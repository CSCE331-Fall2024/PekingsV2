import csv
import random
from datetime import datetime, timedelta

order_id = 1

# Inventory data
inventory = {
    1: "Carrots", 2: "Peas", 3: "Rice", 4: "Soy Sauce", 5: "MSG", 6: "Cabbage", 7: "Egg Noodles",
    8: "Chicken", 9: "Beef", 10: "Shrimp", 11: "Broccoli", 12: "Steamed Rice", 13: "Oranges", 
    14: "Egg Roll Wrappers", 15: "Onion", 16: "Red Pepper", 17: "Beijing Beef Sauce", 
    18: "Teriyaki Sauce", 19: "Crab", 20: "Wonton Wrapper", 21: "Flour", 22: "Sugar", 
    23: "Butter", 24: "Chinese 5 Spice", 25: "Duck", 26: "Garlic", 27: "Pepper", 
    28: "Red Pepper", 29: "Steak", 30: "Sweet & Sour Sauce", 31: "Small cup", 
    32: "Medium cup", 33: "Large cup"
}

# Menu item to ingredients mapping (simplified for demonstration)
menu_ingredients = {
    3: [31], 4: [32], 5: [33], 6: [1, 2, 3, 4, 5, 8], 7: [1, 2, 3, 4, 5, 9],
    8: [1, 2, 3, 4, 5, 10], 9: [6, 7, 4, 8], 10: [6, 7, 4, 9], 
    11: [6, 7, 4, 10], 12: [11, 9, 3, 4], 13: [13, 8, 3],
    14: [14, 8, 6, 1, 15], 15: [14, 6, 1, 15], 16: [9, 16, 15, 3, 17, 26],
    17: [8, 18, 3], 18: [19, 20], 19: [21, 22, 23], 20: [24, 25, 3], 
    21: [8, 27, 16, 15, 3], 22: [30, 3, 8,]
}

# Peak and regular day multipliers
PEAK_DAYS = [random.randint(1, 364), random.randint(1, 364)]  # Two random peak days
PEAK_MULTIPLIER = 2.5  # Sales spike on peak days
REGULAR_SALES = 1000000  # Approximate target sales
TOTAL_DAYS = 364
DAILY_SALES_TARGET = REGULAR_SALES / TOTAL_DAYS

# Menu data with prices
menu = {
    3: 1.00, 4: 1.50, 5: 2.00, 6: 10.00, 7: 10.00, 8: 10.00, 9: 10.00,
    10: 10.00, 11: 10.00, 12: 10.00, 13: 10.00, 14: 2.00, 15: 2.00, 
    16: 10.00, 17: 10.00, 18: 2.00, 19: 0.25, 20: 15.00, 21: 10.00, 
    22: 10.00
}

# Helper functions
def random_payment_method():
    return random.choice(['credit_card', 'cash'])

def random_timestamp(base_date):
    # Generate random hour, minute, and second

    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    random_time = base_date + timedelta(hours=hour, minutes=minute, seconds=second)
    return random_time.strftime('%Y-%m-%d %H:%M:%S')

def generate_random_order(day, is_peak):
    
    global order_id
    base_date = datetime(2024, 1, 1) + timedelta(days=day)  # Start from 2024-01-01
    sales_today = DAILY_SALES_TARGET * PEAK_MULTIPLIER if is_peak else DAILY_SALES_TARGET
    current_sales = 0
    orders = []
    order_items = []
    order_inventory = []
    
    while current_sales < sales_today:
        customer_id = random.randint(1, 1000)
        employee_id = random.randint(1, 6)
        order_time = random_timestamp(base_date)
        payment_method = random_payment_method()

        # Handle multiple menu items per order
        num_items = random.randint(1, 3)  # Randomly pick 1 to 3 items per order
        items_in_order = random.sample(list(menu.keys()), num_items)  # Select random menu items

        total_order_price = 0
        for menu_item_id in items_in_order:
            price = menu[menu_item_id]
            total_order_price += price
            current_sales += price

            # Add each item to order_items
            order_items.append([order_id, menu_item_id])

            # Add each ingredient to order_inventory
            ingredients = menu_ingredients.get(menu_item_id, [])
            for ingredient in ingredients:
                order_inventory.append([order_id, ingredient])

        # Add the order once with the correct total price
        orders.append([order_id, customer_id, total_order_price, payment_method, employee_id, order_time])
        
        order_id += 1  # Increment order_id after processing the current order
    return orders, order_items, order_inventory

# CSV file writing function
def write_csv(filename, headers, data):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(data)

# Data generation for 364 days with 2 peak days
all_orders = []
all_order_items = []
all_order_inventory = []
for day in range(TOTAL_DAYS):
    is_peak = day in PEAK_DAYS
    orders, order_items, order_inventory = generate_random_order(day, is_peak)
    all_orders.extend(orders)
    all_order_items.extend(order_items)
    all_order_inventory.extend(order_inventory)

# Write the data to CSV files
write_csv('./orders.csv', ['id', 'customer_id', 'price', 'payment_method', 'employee_id', 'order_time'], all_orders)
write_csv('./order_items.csv', ['order_id', 'menu_item_id'], all_order_items)
write_csv('./order_inventory.csv', ['order_id', 'inventory_id'], all_order_inventory)
