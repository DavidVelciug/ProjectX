import torch
from torch.utils.data import Dataset, DataLoader, TensorDataset, ConcatDataset
from torchvision import transforms, datasets


class MNISTDataset(Dataset):
	def __init__(self, root="Data", train=True, transform=None, download=True):
		self.dataset = datasets.MNIST(root=root, train=train, transform=transform, download=download)
		self.transform = transform if transform else transforms.ToTensor()

	def __len__(self):
		return len(self.dataset)

	def __getitem__(self, index):
		img, target = self.dataset[index]
		img = self.transform(img) if self.transform else img
		target = torch.tensor(target, dtype=torch.long)
		return img, target

	def create_dataloader(self, batch_size=64, shuffle=True, download=False):
		pixels = 28
		blank_label = 10
		count_img = 6000

		img_tensors = torch.zeros((count_img, 1, pixels, pixels))
		target_tensors = torch.full((count_img,), blank_label, dtype=torch.long)
		blank_dataset = TensorDataset(img_tensors, target_tensors)

		combined_ds = ConcatDataset([self, blank_dataset])
		return DataLoader(dataset=combined_ds, batch_size=batch_size, shuffle=shuffle)


train_loader_mnist = MNISTDataset().create_dataloader(batch_size=128, download=True)
test_loader_mnist = MNISTDataset(train=False).create_dataloader(batch_size=128, shuffle=False, download=True)
