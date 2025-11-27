from pathlib import Path
from typing import Union, List, Tuple
import torch
from torch import nn

from .networks import MLP, Perceptron, CNN


class ModelManager:
	def __init__(self, models_dir=None, device='cpu'):
		if models_dir is None:
			current_dir = Path(__file__).parent
			self.models_dir = current_dir / "db_pth"
		else:
			self.models_dir = Path(models_dir)

		self.device = device
		self.models = {}
		self._load_all_models()

	def _load_all_models(self):
		model_configs = {
			"Perceptron": Perceptron,
			"MLP": MLP,
			"CNN": CNN,
		}

		for name, model_class in model_configs.items():
			model = model_class()
			model_path = self.models_dir / f"{name}.pth"
			if model_path.exists():
				try:
					state_dict = torch.load(model_path, map_location=self.device)
					model.load_state_dict(state_dict)
					print(f"+ {name} ")
				except Exception as e:
					print(f"⚠{name}: {type(e).__name__} → {e}")
			else:
				print(f"{name}.pth не найден")

			model.to(self.device)
			model.eval()
			self.models[name] = model

	def get_model(self, model_name: str):
		if model_name not in self.models:
			raise ValueError(f"Модель {model_name} не найдена. Доступные: {list(self.models.keys())}")
		return self.models[model_name]

	def get_available_models(self):
		return list(self.models.keys())

	def predict(self, model: nn.Module, data: Union[List[int], torch.Tensor]) -> Tuple[List[float], int]:
		"""
		:param model: Perceptron/MLP/CNN
		:param data: вектор/тензор пикселей
		:return:
			Лист вероятностей чисел
	        Распознанная цифра от 0 до 9
		"""
		if isinstance(data, list):
			data = torch.tensor(data, dtype=torch.float32)

		if data.dim() == 1:
			data = data.unsqueeze(0)

		if isinstance(model, CNN):
			if data.dim() == 2 and data.size(1) == 784:
				data = data.view(-1, 1, 28, 28)

		with torch.no_grad():
			output = model(data)
			probs_tensor = torch.softmax(output, dim=1)
			pred_class = torch.argmax(probs_tensor, dim=1).item()

			probs_list = probs_tensor.squeeze().tolist()
			if not isinstance(probs_list, list):
				probs_list = [probs_list]
			probs_dict = {i: prob for i, prob in enumerate(probs_list)}

			return probs_dict, pred_class, model.activations


model_manager = ModelManager()

