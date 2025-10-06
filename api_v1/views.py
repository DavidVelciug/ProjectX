import torch
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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

		result = []
		for i, network in enumerate(_models):
			pixels, height = base64_to_pixel_vector(image)
			tensor: torch.Tensor = preprocess_image_to_tensor(pixels, height)
			model_nn = model_manager.get_model(network)
			probs, y_pred, activations = model_manager.predict(model_nn, tensor)
			res = {
				"model": network,
				"digit": y_pred,
				"probabilities": probs,
				"activations": activations
			}
			result.append(res)
			if not i:
				...
				#	Canvas.objects.create(target=target, predict=y_pred, pixels=pixels)

		return Response(result, status=status.HTTP_200_OK)
