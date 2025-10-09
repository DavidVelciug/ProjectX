## ProjectX

<p align="center">
  <img src="https://github.com/DavidVelciug/ProjectX/blob/master/static/img/%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9.png" alt="Logo" width="300">
</p>

## About

- **Django application** with a REST API under `api_v1`
  - Supports POST requests
  - Data serialization
- **Web interface** using HTML / CSS / JavaScript (2D / 3D visualizations, text pages, etc.)
- **Machine Learning module** (`ml/`)
  - MNIST data processing
  - Loading and using models (CNN, MLP, Perceptron, etc.)
  - Network training and architectures
  - Pretrained weights stored in `ml/db_pth/`
- **General theory module** `app/`
- **Digit recognition module** for forms
- **Saving generated images** in `ml/saved_images/`
- **Static resources** (CSS, JS, images)
- **SQLite** as the default database

<h3 align="center">Frameworks & Libraries</h3>
<p align="center">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/Django REST-ff1709?style=for-the-badge&logo=django&logoColor=white" alt="DRF">
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch">
  <img src="https://img.shields.io/badge/TorchVision-FF6F00?style=for-the-badge&logo=python&logoColor=white" alt="TorchVision">
  <img src="https://img.shields.io/badge/Matplotlib-11557C?style=for-the-badge&logo=matplotlib&logoColor=white" alt="Matplotlib">
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy">
</p>

## Installing

<b>Git clone & path to Source Code File<b>

```bash
git clone "https://github.com/DavidVelciug/ProjectX.git"
cd src
```

<b>Virtual environment (venv)</b>

```bash
python -m venv venv
source venv/bin/activate    # Linux/macOS
venv\Scripts\activate       # Windows
```

<b>Download requirements & run server</b>

```bash
pip install -r req.txt
python manage.py runserver
```

## Documentation

## API

<h4>POST /api_v1/recognize/</h4>

```bash
POST /api_v1/recognize/
Content-Type: application/json
```

<b>Body request</b>

```json
{
  "target": 7,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "models": ["CNN", "MLP", "Perceptron"]
}
```

<h3>Request Parameters <code>/api/recognize</code></h3>

<table>
  <tr>
    <th>Field</th>
    <th>Type</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>target</code></td>
    <td><code>int</code></td>
    <td>No</td>
    <td>Expected digit (0–9), used for comparison with the prediction</td>
  </tr>
  <tr>
    <td><code>image</code></td>
    <td><code>string</code></td>
    <td>Yes</td>
    <td>Image in Base64 format (e.g., canvas content)</td>
  </tr>
  <tr>
    <td><code>models</code></td>
    <td><code>list[string]</code></td>
    <td>No</td>
    <td>Names of the models to make predictions (default is <code>"CNN"</code>)</td>
  </tr>
</table>

## 📂 Project Structure

📁 **api_v1** — REST API  
📁 **app** — General logic / main application  
📁 **blank** — Number recognition module  
📁 **config** — Settings and configuration files  
📁 **ml** — Machine Learning module (models, utils, pre-trained weights)  
📁 **static** — Static files (JS, CSS, images)  
📁 **templates** — HTML templates  
📄 **db.sqlite3** — Database file  
📄 **manage.py** — Main Django entry point  
📄 **req.txt** — Requirements / dependencies file

## Developers

<p align="center">
  <a href="https://github.com/DavidVelciug">
    <img src="https://img.shields.io/badge/Front--End_Author_1-000000?style=for-the-badge&logo=github&logoColor=white" alt="Front-End Author 1">
  </a>
  <a href="https://github.com/DavidVelciug">
    <img src="https://img.shields.io/badge/Front--End_Author_2-555555?style=for-the-badge&logo=github&logoColor=white" alt="Front-End Author 2">
  </a>
  <a href="https://github.com/DavidVelciug">
    <img src="https://img.shields.io/badge/Back--End_Author_3-888888?style=for-the-badge&logo=github&logoColor=white" alt="Back-End Author 3">
  </a>
  <a href="https://github.com/DavidVelciug">
    <img src="https://img.shields.io/badge/Back--End_Author_4-AAAAAA?style=for-the-badge&logo=github&logoColor=white" alt="Back-End Author 4">
  </a>
</p>
