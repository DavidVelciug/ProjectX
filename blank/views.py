from pprint import pprint

import torch
from PIL import Image, ImageOps, ImageDraw
from torchvision import transforms
from src.ml.services.model_loader import model_manager

start_x = 84
start_y = 436
stand_square_x = 23
stand_square_y = 35
stand_size = (28, 28)
step_x = 8.5
step_y = 11
file_name = r"C:\Users\user\Desktop\ProjectX\pr-blank20_page-0002.jpg"

transform = transforms.Compose([
	transforms.Grayscale(),
	transforms.ToTensor(),
])


models = model_manager.get_available_models()

results = {}
with Image.open(file_name) as img:
	img.load()
	for nn in models:
		results[nn] = []
		for j in range(5):
			res = []
			for i in range(19):
				cur_x = start_x + i * (step_x + stand_square_x)
				cur_y = start_y + j * (step_y + stand_square_y)
				cropped_img = img.crop((cur_x, cur_y, cur_x + stand_square_x, cur_y + stand_square_y))
				inverted_img = ImageOps.invert(cropped_img)

				padded_img = ImageOps.expand(inverted_img, border=5, fill=0)

				resize_img_to_standard = padded_img.resize((28, 28), Image.Resampling.LANCZOS)

				# resize_img_to_standard.show()
				tensor: torch.Tensor = transform(resize_img_to_standard).unsqueeze(0)
				model = model_manager.get_model(nn)
				output = model_manager.predict(model, tensor)
				res.append(output[1])
				if output[1] == 10:
					break
			results[nn].append(res)
with Image.open(file_name) as img:
	img.load()
	draw = ImageDraw.Draw(img)
	for j in range(5):
		for i in range(15):
			cur_x = start_x + i * (step_x + stand_square_x)
			cur_y = start_y + j * (step_y + stand_square_y)
			box = (cur_x, cur_y, cur_x + stand_square_x, cur_y + stand_square_y)
			draw.rectangle(box, outline="red", width=2)

	img.show()

pprint(results)
