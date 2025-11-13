import base64
from io import BytesIO
from typing import List, Tuple

import numpy as np
from PIL import Image


def base64_to_pixel_vector(data_url: str, target_size=(28, 28), show: bool = False) -> Tuple[List[int], int]:
    """
    Преобразует base64 изображение в вектор пикселей и размер.

    :param data_url: "data:image/png;base64,iVBORw0KGgo..."
    :param target_size: целевой размер изображения (width, height)
    :param show: если True, отображает изображение через PIL.Image.show()
    :return: (вектор пикселей, ширина изображения)
    """
    base64_data = data_url.split(',', 1)[1]
    image_data = base64.b64decode(base64_data)

    image = Image.open(BytesIO(image_data))

    if image.mode != 'L':
        image = image.convert('L')

    image = image.resize(target_size, Image.Resampling.LANCZOS)

    if show:
        image.show()

    pixel_array = np.array(image)
    pixel_vector = pixel_array.flatten().astype(int).tolist()

    return pixel_vector, target_size[0]


def pixels_to_image_base64(pixels, scale=10):
    """
    Преобразует JSON-пиксели в base64 PNG.
    Поддерживает 1D и 2D массивы.
    scale — масштабирование для увеличения изображения в админке.
    """
    arr = np.array(pixels, dtype=np.float32)

    arr = arr - arr.min()
    if arr.max() > 0:
        arr = arr / arr.max()
    arr = (arr * 255).astype(np.uint8)

    if arr.ndim == 1:
        size = int(np.sqrt(arr.size))
        if size * size != arr.size:
            raise ValueError("pixels array не квадратный")
        arr = arr.reshape((size, size))
    elif arr.ndim == 3:
        arr = arr[0] if arr.shape[0] <= 4 else arr[..., 0]

    img = Image.fromarray(arr, mode='L')

    w, h = img.size
    img = img.resize((w * scale, h * scale), Image.NEAREST)

    buffer = BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()