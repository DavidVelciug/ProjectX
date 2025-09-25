import base64
from io import BytesIO
from typing import List

import numpy as np
from PIL import Image


def base64_to_pixel_vector(data_url: base64, target_size=(28, 28)) -> List[int]:
	"""
	:param data_url: "data:image/png;base64,iVBORw0KGgo..."
	:param target_size: целевой размер изображения
	:return:вектор пикселей
	"""
	base64_data = data_url.split(',', 1)[1]
	image_data = base64.b64decode(base64_data)
	image = Image.open(BytesIO(image_data))

	if image.mode != 'L':
		image = image.convert('L')

	image = image.resize(target_size, Image.Resampling.LANCZOS)
	pixel_array = np.array(image)
	pixel_vector = pixel_array.flatten().astype(int).tolist()

	return pixel_vector, target_size[0]
