from pathlib import Path
from typing import Union
from torch.utils.data import DataLoader
from torchvision import transforms, datasets


def df_loader(root: Union[str, Path] = "Data",
              train: bool = True,
              transform: transforms = None,
              download=True,
              butch_size: int = 64,
              shuffle: bool = True,
              ):
    """
    :param root: путь к файлу, где сохранится файл
    :param train: обучаем или тестируем
    :param transform: преобразование данных
    :param download: скачать файл MNIST
    :param butch_size: пакетная обработка
    :param shuffle: рандомизировать данные
    :return:
    """
    _df = datasets.MNIST(root=root, train=train, transform=transform, download=download)
    data_loader = DataLoader(dataset=_df, batch_size=butch_size, shuffle=shuffle)
    return data_loader