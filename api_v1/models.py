from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class Canvas(models.Model):
	target = models.PositiveSmallIntegerField(
		validators=[
			MinValueValidator(0),
			MaxValueValidator(9)
		], null=True)
	predict = models.PositiveSmallIntegerField(
		validators=[
			MinValueValidator(0),
			MaxValueValidator(9)
		])
	pixels = models.JSONField()
