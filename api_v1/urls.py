from django.urls import path
from . import views

urlpatterns = [
    path('recognize', views.GetCanvasInfoView.as_view()),
]