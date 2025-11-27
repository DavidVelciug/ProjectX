from django.urls import path
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('2d/', views.nn_2d, name='2d'),
	path('2d/<str:animation_name>/', views.animation, name='animation'),
	path('3d/', views.nn_3d, name='3d'),
	path('app/', views.app, name='app'),
	path('text/', views.text, name='text'),
	path('aboutproject/', views.aboutproject, name="aboutproject"),
	path("<str:section_id>/", views.load_section, name="section"),
]