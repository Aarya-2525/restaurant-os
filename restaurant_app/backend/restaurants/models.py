from django.db import models

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cuisine = models.CharField(max_length=200)
    address = models.TextField()
    map_url = models.URLField(blank=True)

    # Customization
    primary_color = models.CharField(max_length=7, default='#2563eb') # Blue-600
    secondary_color = models.CharField(max_length=7, default='#1e40af') # Blue-800
    background_color = models.CharField(max_length=7, default='#ffffff') # White
    font_choice = models.CharField(max_length=50, default='Inter')

    def __str__(self):
        return self.name

class MenuCategory(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"

class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    category = models.ForeignKey(MenuCategory, on_delete=models.SET_NULL, null=True)
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True)

    is_veg = models.BooleanField(default=False)
    is_non_veg = models.BooleanField(default=False)
    is_jain = models.BooleanField(default=False)
    is_chefs_special = models.BooleanField(default=False)

    cooking_time_minutes = models.IntegerField(default=10)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("preparing", "Preparing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    table_number = models.IntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    estimated_wait_time = models.IntegerField(default=0)  # shown to customer

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - Table {self.table_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)

    quantity = models.IntegerField(default=1)
    item_price = models.DecimalField(max_digits=7, decimal_places=2)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"

import qrcode
from io import BytesIO
from django.core.files import File

class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    number = models.IntegerField()
    qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)

    class Meta:
        unique_together = ('restaurant', 'number')

    def save(self, *args, **kwargs):
        if not self.qr_code:
            # Generate QR Code
            # TODO: Make base URL configurable
            frontend_url = "http://192.168.29.121:5173" # Change YOUR_LAPTOP_IP to your laptop's local IP address
            qr_data = f"{frontend_url}/menu?restaurant_id={self.restaurant.id}&table={self.number}"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            self.qr_code.save(f'qr_table_{self.restaurant.id}_{self.number}.png', File(buffer), save=False)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Table {self.number} - {self.restaurant.name}"
