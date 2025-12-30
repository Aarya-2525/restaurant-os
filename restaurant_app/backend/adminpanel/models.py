from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Create your models here.

class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} ({self.restaurant.name})"
