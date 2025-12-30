from rest_framework import serializers
from .models import Restaurant, MenuCategory, MenuItem, Order, OrderItem

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ['id', 'name']

class MenuItemSerializer(serializers.ModelSerializer):
    category = MenuCategorySerializer(read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'image',
            'is_veg', 'is_non_veg', 'is_jain', 'is_chefs_special',
            'cooking_time_minutes',
            'category'
        ]

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'cuisine', 'address', 'map_url']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'item_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'restaurant',
            'table_number',
            'status',
            'estimated_wait_time',
            'created_at',
            'items'
        ]

class OrderCreateItemSerializer(serializers.Serializer):
    menu_item = serializers.IntegerField()
    quantity = serializers.IntegerField()

class OrderCreateSerializer(serializers.Serializer):
    table_number = serializers.IntegerField()
    items = OrderCreateItemSerializer(many=True)

    def create(self, validated_data):
        restaurant = self.context.get("restaurant")

        order = Order.objects.create(
            restaurant=restaurant,
            table_number=validated_data["table_number"],
            status="pending"
        )

        items_data = validated_data["items"]
        longest_time = 0  # <-- track longest cooking time

        for item in items_data:
            menu_item_obj = MenuItem.objects.get(id=item["menu_item"])

            # Track the max cooking time
            if menu_item_obj.cooking_time_minutes > longest_time:
                longest_time = menu_item_obj.cooking_time_minutes

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item_obj,
                quantity=item["quantity"],
                item_price=menu_item_obj.price
            )

        # Save the longest cooking time into the order
        order.estimated_wait_time = longest_time
        order.save()

        return order
