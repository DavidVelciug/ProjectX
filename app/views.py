from django.http import Http404
from django.shortcuts import render
from django.template import TemplateDoesNotExist

# Create your views here.

def index(request):
	return render(request, "index.html", {"css": "css/index.css"})


def nn_2d(request):
	return render(request, "2d.html")


def nn_3d(request):
	return render(request, "3d.html")


def app(request):
	return render(request, "app.html")


def text(request):
	return render(request, "text.html")


def aboutproject(request):
	return render(request, "aboutproject.html")


def load_section(request, section_id):
	try:
		return render(request, f"sections/{section_id}.html")
	except TemplateDoesNotExist:
		raise Http404(f"Section '{section_id}' not found")
