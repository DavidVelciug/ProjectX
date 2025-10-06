from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class CanvasSerializer(serializers.Serializer):
	# height = serializers.IntegerField()
	# width = serializers.IntegerField()
	target = serializers.IntegerField(min_value=0, max_value=9, allow_null=True)
	image = serializers.JSONField()
	models = serializers.StringRelatedField()
