from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    AdminOrdersView,
    AdminOrderUpdateView,
    AddMenuItemView,
    UpdateMenuItemView,
    MenuCSVUploadView,
    RestaurantSettingsView,
    TableListView,
    TableDetailView,
)

urlpatterns = [

    # JWT AUTH
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),

    # ORDER Management
    path('orders/', AdminOrdersView.as_view()),
    path('orders/<int:order_id>/', AdminOrderUpdateView.as_view()),

    # MENU Management
    path('menu/', AddMenuItemView.as_view()),
    path('menu/<int:pk>/', UpdateMenuItemView.as_view()),
    path('menu/<int:pk>/', UpdateMenuItemView.as_view()),
    path('menu/csv-upload/', MenuCSVUploadView.as_view()),
    
    
    # Settings
    path('settings/', RestaurantSettingsView.as_view()),
    
    # Tables & QR Codes
    path('tables/', TableListView.as_view()),
    path('tables/<int:pk>/', TableDetailView.as_view()),
]
