from django.shortcuts import render


# Create your views here.

def index(request):
	return render(request, "index.html")


def nn_2d(request):
	return render(request, "2d.html")


def nn_3d(request):
	return render(request, "3d.html")


def app(request):
	return render(request, "app.html")


def text(request):
	return render(request, "text.html")