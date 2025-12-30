from django.urls import path
from .views import RestaurantMenuView, OrderCreateView, OrderDetailView

urlpatterns = [
    path('restaurants/<int:restaurant_id>/menu/', RestaurantMenuView.as_view()),
    path('restaurants/<int:restaurant_id>/orders/', OrderCreateView.as_view()),
    path('restaurants/<int:restaurant_id>/orders/<int:order_id>/', OrderDetailView.as_view()),
]
