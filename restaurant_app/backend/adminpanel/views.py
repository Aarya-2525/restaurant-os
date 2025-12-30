from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from restaurants.models import Order, MenuItem, MenuCategory
from restaurants.serializers import OrderSerializer

from adminpanel.models import StaffProfile
from adminpanel.serializers import (
    AdminOrderUpdateSerializer,
    AddMenuItemSerializer,
    RestaurantSettingsSerializer
)

import csv
from io import TextIOWrapper


# -------------------------------
# GET ALL ORDERS (Admin)
# -------------------------------
class AdminOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant

        # Get valid table numbers
        valid_table_numbers = Table.objects.filter(restaurant=restaurant).values_list('number', flat=True)

        orders = Order.objects.filter(
            restaurant=restaurant,
            table_number__in=valid_table_numbers
        ).order_by('-created_at')

        return Response(OrderSerializer(orders, many=True).data)

    def delete(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        
        # Clear completed and cancelled orders
        deleted_count, _ = Order.objects.filter(
            restaurant=restaurant, 
            status__in=['completed', 'cancelled']
        ).delete()
        
        return Response({"message": f"Cleared {deleted_count} orders."})


# -------------------------------
# UPDATE ORDER STATUS
# -------------------------------
class AdminOrderUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, order_id):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant

        try:
            order = Order.objects.get(id=order_id, restaurant=restaurant)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminOrderUpdateSerializer(order, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Order updated successfully"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# ADD MENU ITEM
# -------------------------------
class AddMenuItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant

        data = request.data.copy()
        data["restaurant"] = restaurant.id

        serializer = AddMenuItemSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Menu item added successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# UPDATE MENU ITEM (Image Upload etc)
# -------------------------------
class UpdateMenuItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant

        try:
            item = MenuItem.objects.get(id=pk, restaurant=restaurant)
        except MenuItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        # Handle image removal (frontend sends 'null' string in FormData or null in JSON)
        if data.get('image') == 'null' or data.get('image') == '':
            data['image'] = None

        serializer = AddMenuItemSerializer(item, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# CSV BULK UPLOAD
# -------------------------------
class MenuCSVUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant

        csv_file = request.FILES.get("file")

        if not csv_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        csv_reader = csv.DictReader(TextIOWrapper(csv_file.file, encoding='utf-8'))

        created_items = 0

        for row in csv_reader:
            # Create or get category
            category, _ = MenuCategory.objects.get_or_create(
                restaurant=restaurant,
                name=row["category"]
            )

            is_veg = row["is_veg"].lower() == "true"
            # Logic: If not veg, then it is non-veg
            is_non_veg = not is_veg

            # Prepare data for serializer
            item_data = {
                "restaurant": restaurant.id,
                "category": category.id,
                "name": row["name"],
                "description": row.get("description", ""),
                "price": row["price"],
                "is_veg": is_veg,
                "is_non_veg": is_non_veg,
                "is_jain": row["is_jain"].lower() == "true",
                "is_chefs_special": row["is_chefs_special"].lower() == "true",
                "cooking_time_minutes": row["cooking_time_minutes"],
            }

            serializer = AddMenuItemSerializer(data=item_data)
            if serializer.is_valid():
                serializer.save()
                created_items += 1

        return Response({"message": f"{created_items} items uploaded successfully"})


# -------------------------------
# RESTAURANT SETTINGS (Colors, etc.)
# -------------------------------
from rest_framework.permissions import IsAuthenticated, AllowAny

class RestaurantSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        serializer = RestaurantSettingsSerializer(restaurant)
        return Response(serializer.data)

    def put(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        serializer = RestaurantSettingsSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# TABLE & QR CODE MANAGEMENT
# -------------------------------
from restaurants.models import Table
from adminpanel.serializers import TableSerializer

class TableListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        tables = Table.objects.filter(restaurant=restaurant).order_by('number')
        return Response(TableSerializer(tables, many=True).data)

    def post(self, request):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        
        number = request.data.get('number')
        if not number:
            return Response({"error": "Table number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if table number already exists for this restaurant
        if Table.objects.filter(restaurant=restaurant, number=number).exists():
            return Response({"error": "Table number already exists"}, status=status.HTTP_400_BAD_REQUEST)

        table = Table.objects.create(restaurant=restaurant, number=number)
        return Response(TableSerializer(table).data, status=status.HTTP_201_CREATED)


class TableDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        staff = StaffProfile.objects.get(user=request.user)
        restaurant = staff.restaurant
        
        try:
            table = Table.objects.get(id=pk, restaurant=restaurant)
            table.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Table.DoesNotExist:
            return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)
