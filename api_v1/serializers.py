from rest_framework import serializers
from rest_framework.exceptions import ValidationError

class CanvasSerializer(serializers.Serializer):
	# height = serializers.IntegerField()
	# width = serializers.IntegerField()
	target = serializers.IntegerField(min_value=0, max_value=9, allow_null=True)
	image = serializers.CharField()  # Base64 data URL string
	models = serializers.ListField(
		child=serializers.CharField(),
		required=False,
		default=["CNN"]
	)
