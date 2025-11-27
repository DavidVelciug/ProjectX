from torch import nn, tensor


class MLP(nn.Module):
	def __init__(self):
		super().__init__()
		self.fc1 = nn.Linear(784, 128)
		self.fc2 = nn.Linear(128, 128)
		self.fc3 = nn.Linear(128, 11)
		self.relu = nn.ReLU()
		self.activations = {}

	def forward(self, x: tensor):
		x = x.view(x.size(0), -1)
		x = self.relu(self.fc1(x))
		self.activations["hidden_layer_1"] = x
		x = self.relu(self.fc2(x))
		self.activations["hidden_layer_2"] = x
		x = self.fc3(x)
		self.activations["output"] = x
		return x


class Perceptron(nn.Module):
	def __init__(self):
		super().__init__()
		self.func1 = nn.Linear(784, 11)
		self.relu = nn.LeakyReLU()
		self.activations = {}

	def forward(self, x: tensor):
		x = x.view(x.size(0), -1)
		self.activations["output"] = x
		return self.func1(x)


class CNN(nn.Module):
	def __init__(self):
		super().__init__()
		self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
		self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
		self.pool = nn.MaxPool2d(2, 2)
		self.fc1 = nn.Linear(64 * 7 * 7, 128)
		self.dropout = nn.Dropout(0.3)
		self.fc2 = nn.Linear(128, 11)
		self.relu = nn.ReLU()
		self.activations = {}

		for layer in [self.conv1, self.conv2, self.fc1, self.fc2]:
			if hasattr(layer, 'weight'):
				nn.init.xavier_uniform_(layer.weight)

	def forward(self, x: tensor):
		x = self.relu(self.conv1(x))
		self.activations["conv1"] = x
		x = self.pool(x)
		self.activations["pool1"] = x

		x = self.relu(self.conv2(x))
		self.activations["conv2"] = x
		x = self.pool(x)
		self.activations["pool2"] = x

		x = x.view(x.size(0), -1)
		x = self.relu(self.fc1(x))
		self.activations["fc1"] = x
		x = self.dropout(x)
		self.activations["dropout"] = x

		x = self.fc2(x)
		self.activations["output"] = x
		return x
