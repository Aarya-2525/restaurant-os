def calculate_longest_cooking_time(order_items):
    return max(item.menu_item.cooking_time_minutes for item in order_items)
