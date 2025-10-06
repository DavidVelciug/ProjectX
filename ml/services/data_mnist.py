from pathlib import Path
from typing import Union

import torch
from torch.utils.data import Dataset, DataLoader, TensorDataset, ConcatDataset
from torchvision import transforms, datasets


class MNISTWithTensorTargets(Dataset):
	def __init__(self, root, train=True, transform=None, download=False):
		self.mnist = datasets.MNIST(root=root, train=train, transform=transform, download=download)

	def __getitem__(self, index):
		img, target = self.mnist[index]
		target = torch.tensor(target, dtype=torch.long)
		return img, target

	def __len__(self):
		return len(self.mnist)


def df_loader(root: Union[str, Path] = "Data",

              train: bool = True,
              transform: transforms = None,
              download=False,
              batch_size: int = 64,
              shuffle: bool = True,
              ):
	"""
    :param root: путь к файлу, где сохранится файл
    :param train: обучаем или тестируем
    :param transform: преобразование данных
    :param download: скачать файл MNIST
    :param batch_size: пакетная обработка
    :param shuffle: рандомизировать данные
    :return:
    """
	if transform is None:
		transform = transforms.Compose([
			transforms.ToTensor()
		])
	if transform is None:
		transform = transforms.Compose([transforms.ToTensor()])

	mnist = MNISTWithTensorTargets(root=root,
	                               train=train,
	                               transform=transform,
	                               download=download)

	pixels = 28
	blank_label = 10
	count_img = 6000

	img_tensors = torch.zeros((count_img, 1, pixels, pixels))
	target_tensors = torch.full((count_img,), blank_label, dtype=torch.long)

	blank_dataset = TensorDataset(img_tensors, target_tensors)

	combined_ds = ConcatDataset([mnist, blank_dataset])

	return DataLoader(dataset=combined_ds, batch_size=batch_size, shuffle=shuffle)


train_loader = df_loader(train=True, batch_size=128)

test_loader = df_loader(train=False, batch_size=128, shuffle=False)
