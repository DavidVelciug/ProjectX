from pathlib import Path
from typing import Union, Optional, Tuple
import json
from tqdm import tqdm
import torch
from torch import nn
from torch import optim
from torch.utils.data import DataLoader

from networks import Perceptron, MLP, CNN
from data_mnist import train_loader_mnist, test_loader_mnist


class NeuralNetworkTrainer:
	def __init__(self, model: nn.Module, device: Optional[torch.device] = None):
		self.model = model
		self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')
		self.model.to(self.device)

		self.train_history = {
			'loss': [],
			'accuracy': [],
			'val_loss': [],
			'val_accuracy': []
		}

	def train(self, train_loader: DataLoader,
	          optimizer: optim.Optimizer,
	          _criterion: nn.Module,
	          epochs: int = 10,
	          val_loader: Optional[DataLoader] = None,
	          verbose: bool = True) -> None:
		"""
		:param train_loader: DataLoader данные для обучения
		:param optimizer: Union[optim.Adam, ...] оптимизация функций
		:param _criterion: функция для классификации
		:param epochs: кол-во эпох обучения
		:param val_loader: DataLoader для вариационных данных
		:param verbose: вывод подробной информации обучения
		:return:
		"""

		self.model.train()

		for epoch in range(epochs):
			train_loss, train_acc = self._train_epoch(
				train_loader, optimizer, _criterion, epoch, epochs, verbose
			)

			val_loss, val_acc = None, None
			if val_loader:
				val_loss, val_acc = self._validate(val_loader, _criterion)

			self._update_history(train_loss, train_acc, val_loss, val_acc)

			if verbose:
				self._print_epoch_results(epoch, epochs, train_loss, train_acc,
				                          val_loss, val_acc)

	def _train_epoch(self, data_loader: DataLoader,
	                 optimizer: optim.Optimizer,
	                 _criterion: nn.Module,
	                 epoch: int,
	                 epochs: int,
	                 verbose: bool) -> Tuple[float, float]:
		running_loss = 0.0
		correct = 0
		total = 0

		progress_bar = tqdm(data_loader, desc=f'Epoch {epoch + 1}/{epochs}') if verbose else data_loader

		for batch_idx, (inputs, targets) in enumerate(progress_bar):
			inputs, targets = inputs.to(self.device), targets.to(self.device)

			self.model.zero_grad()
			outputs = self.model(inputs)
			loss = _criterion(outputs, targets)
			loss.backward()
			optimizer.step()

			running_loss += loss.item() * inputs.size(0)
			_, predicted = torch.max(outputs.data, 1)
			total += targets.size(0)
			correct += (predicted == targets).sum().item()

			if verbose:
				progress_bar.set_postfix({
					'loss': running_loss / total,
					'acc': 100. * correct / total
				})

		epoch_loss = running_loss / total if total > 0 else 0
		epoch_acc = 100. * correct / total if total > 0 else 0

		return epoch_loss, epoch_acc

	def _validate(self, data_loader: DataLoader,
	              _criterion: nn.CrossEntropyLoss):
		self.model.eval()
		val_loss = 0.0
		correct = 0
		total = 0

		with torch.no_grad():
			progress_bar = tqdm(data_loader)
			for batch_idx, (inputs, targets) in enumerate(progress_bar):
				inputs, targets = inputs.to(self.device), targets.to(self.device)

				outputs = self.model(inputs)
				loss = _criterion(outputs, targets)

				val_loss += loss.item() * inputs.size(0)
				_, predicted = torch.max(outputs.data, 1)
				total += targets.size(0)
				correct += (predicted == targets).sum().item()

		self.model.train()

		if total == 0:
			return 0, 0

		return val_loss / total, 100. * correct / total

	def _update_history(self, train_loss: Union[int, float],
	                    train_acc: Union[int, float],
	                    val_loss: Union[int, float],
	                    val_acc: Union[int, float]) -> None:
		self.train_history['loss'].append(train_loss)
		self.train_history['accuracy'].append(train_acc)

		if val_loss is not None:
			self.train_history['val_loss'].append(val_loss)
			self.train_history['val_accuracy'].append(val_acc)

	@staticmethod
	def _print_epoch_results(epoch: int,
	                         epochs: int,
	                         train_loss: Union[int, float],
	                         train_acc: Union[int, float],
	                         val_loss: Union[int, float],
	                         val_acc: Union[int, float]):
		if val_loss is not None:
			print(f'Epoch [{epoch + 1}/{epochs}]: '
			      f'Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}% | '
			      f'Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%')
		else:
			print(f'Epoch [{epoch + 1}/{epochs}]: '
			      f'Loss: {train_loss:.4f}, Accuracy: {train_acc:.2f}%')

	def test_accuracy(self, test_loader: DataLoader):
		self.model.eval()
		correct = 0
		total = 0

		with torch.no_grad():
			for inputs, labels in test_loader:
				inputs, labels = inputs.to(self.device), labels.to(self.device)

				outputs = self.model(inputs)
				_, predicted = torch.max(outputs.data, 1)
				total += labels.size(0)
				correct += (predicted == labels).sum().item()

		accuracy = 100 * correct / total if total > 0 else 0
		print(f'Test Accuracy: {accuracy:.2f}%')
		return accuracy

	def save_weights_biases(self, directory: Union[str, Path], name: Union[str, Path]) -> None:
		"""

		:param directory: path to file
		:param name: name of file
		:return:
		"""
		directory = Path(directory)
		directory.mkdir(parents=True, exist_ok=True)
		directory = directory / f"{name}.pth"
		torch.save(self.model.state_dict(), directory)


cnn = MLP()
train_cnn = NeuralNetworkTrainer(cnn)

train_cnn.train(train_loader_mnist, optim.Adam(cnn.parameters()), nn.CrossEntropyLoss(), epochs=5, val_loader=test_loader_mnist)
train_cnn.save_weights_biases("db_pth", "MLP")