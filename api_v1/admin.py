from django.contrib import admin
from django.utils.html import format_html

from .models import Canvas
from .utils import pixels_to_image_base64


class CanvasAdmin(admin.ModelAdmin):
	list_display = ('id', 'target', 'predict', 'image_preview')
	readonly_fields = ('image_preview',)

	fieldsets = (
		(None, {
			'fields': ('target', 'predict', 'pixels', 'image_preview'),
		}),
	)

	def image_preview(self, obj):
		if not obj.pixels:
			return "-"
		try:
			img_str = pixels_to_image_base64(obj.pixels, scale=2)
			return format_html('<img src="data:image/png;base64,{}" />', img_str)
		except Exception as e:
			return format_html('<span style="color:red;">Ошибка: {}</span>', e)

	image_preview.short_description = 'Preview'


admin.site.register(Canvas, CanvasAdmin)
