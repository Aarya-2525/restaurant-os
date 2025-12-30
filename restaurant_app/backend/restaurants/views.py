from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Restaurant, MenuItem, MenuCategory, Order, OrderItem, Table
from .serializers import (
    MenuItemSerializer,
    MenuCategorySerializer,
    OrderSerializer,
    OrderCreateSerializer
)


# Create your views here.
class RestaurantMenuView(APIView):
    def get(self, request, restaurant_id):

        # Validate restaurant exists
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {"error": "Restaurant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Fetch all categories for this restaurant
        categories = MenuCategory.objects.filter(restaurant=restaurant)

        # For each category, fetch its items
        response_data = []
        for category in categories:
            items = MenuItem.objects.filter(category=category)

            category_data = {
                "id": category.id,
                "name": category.name,
                "items": MenuItemSerializer(items, many=True).data
            }

            response_data.append(category_data)

        return Response(response_data, status=status.HTTP_200_OK)

from .serializers import OrderCreateSerializer, OrderSerializer
from .models import Order

class OrderCreateView(APIView):
    def post(self, request, restaurant_id):

        # Validate restaurant exists
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {"error": "Restaurant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate table exists for this restaurant
        table_number = request.data.get('table_number')
        if not Table.objects.filter(restaurant=restaurant, number=table_number).exists():
            return Response(
                {"error": f"Invalid table number: {table_number}. This table is not registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrderCreateSerializer(
            data=request.data,
            context={"restaurant": restaurant}
        )

        if serializer.is_valid():
            order = serializer.save()

            # Return full order details
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailView(APIView):
    def get(self, request, restaurant_id, order_id):
        try:
            order = Order.objects.get(id=order_id, restaurant_id=restaurant_id)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
