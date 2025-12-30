from rest_framework import serializers
from restaurants.models import Order, MenuItem, Restaurant, Table

class AdminOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']


class AddMenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            'restaurant', 'category', 'name', 'description',
            'price', 'image',
            'is_veg', 'is_jain', 'is_chefs_special',
            'cooking_time_minutes'
        ]

class RestaurantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['primary_color', 'secondary_color', 'background_color', 'font_choice']

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number', 'qr_code']
