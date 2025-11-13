import torch
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Canvas
from .serializers import CanvasSerializer

from ml.services.model_loader import model_manager
from ml.utils import preprocess_image_to_tensor

from .utils import base64_to_pixel_vector


# Create your views here.

class GetCanvasInfoView(APIView):
	def post(self, request):
		data = request.data
		serializer = CanvasSerializer(data=data)

		if not serializer.is_valid():
			return Response(serializer.errors, status=400)

		validated_data = serializer.validated_data

		image = validated_data.get("image")
		target = validated_data.get("target")
		_models = validated_data.get("models", ["CNN"])
		
		# Используем первую модель для основного результата
		primary_model = _models[0] if _models else "CNN"
		pixels, height = base64_to_pixel_vector(image)
		tensor: torch.Tensor = preprocess_image_to_tensor(pixels, height)
		probs, y_pred, layers = model_manager.predict(model_manager.get_model(primary_model), tensor)
		
		# Сохраняем в базу данных
		Canvas.objects.create(target=target, predict=y_pred, pixels=pixels)
		
		# Формируем predictions для фронтенда (массив из 10 элементов для цифр 0-9)
		# probs - это словарь {0: prob0, 1: prob1, ..., 9: prob9}
		predictions = []
		if isinstance(probs, dict):
			# probs - словарь с вероятностями (уже в диапазоне 0-1)
			for digit in range(10):
				prob_value = probs.get(digit, 0.0)
				confidence = float(prob_value) * 100  # Преобразуем в проценты
				predictions.append({
					"digit": digit,
					"confidence": confidence
				})
		elif isinstance(probs, (list, tuple)) and len(probs) >= 10:
			# Если probs - список/кортеж
			for digit in range(10):
				confidence = float(probs[digit]) * 100 if isinstance(probs[digit], (int, float)) else 0.0
				predictions.append({
					"digit": digit,
					"confidence": confidence
				})
		else:
			# Если формат другой, создаем базовую структуру
			for digit in range(10):
				confidence = 100.0 if digit == y_pred else 0.0
				predictions.append({
					"digit": digit,
					"confidence": confidence
				})
		
		# Формируем ответ в формате, ожидаемом фронтендом
		response_data = {
			"digit": int(y_pred),
			"predictions": predictions
		}
		
		return Response(response_data, status=status.HTTP_200_OK)
