from django.contrib import admin

# Register your models here.

from .models import (
    Restaurant,
    MenuCategory,
    MenuItem,
    Order,
    OrderItem
)

admin.site.register(Restaurant)
admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderItem)
