-- get_menu_items
SELECT
    menu.id AS menu_item_id,
    menu.name AS menu_item_name,
    menu.price AS menu_item_price,
    menu.active AS menu_item_active,
    inventory.name AS ingredient_name,
    menu_ingredients.ingredients_in_item AS ingredient_quantity,
    inventory.price_batch AS ingredient_batch_price,
    inventory.serving_price AS serving_price,
    inventory.id AS ingredient_id
FROM
    menu
        JOIN
    menu_ingredients ON menu.id = menu_ingredients.menu_item
        JOIN
    inventory ON menu_ingredients.ingredient_id = inventory.id;

-- add_menu_item
INSERT INTO menu (name, price) VALUES ('%s', '%s');

-- delete_menu_item
DELETE FROM menu WHERE id = '%s';

-- delete_menu_ingredient_menu_item
DELETE FROM menu_ingredients mi WHERE mi.menu_item = '%s';

-- add_ingredient
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES('%s','%s','%s');

-- get_menu_item
SELECT * FROM menu WHERE id = '%s';

-- update_menu_item
UPDATE menu SET name = '%s', price = '%s', active = '%s' WHERE id = '%s';

-- get_menu_item_order
SELECT * FROM order_items WHERE order_id = '%s';

-- get_ingredient
SELECT * FROM inventory WHERE id = '%s';

-- get_menu_item_ingredients
SELECT * FROM menu_ingredients WHERE id = '%s';

-- get_active_employees
SELECT * FROM employees WHERE is_clockedin = 'true';

-- get_all_employees
SELECT * FROM employees;

-- get_top_menu_items_orders
SELECT m.id AS menu_item_id,
       m.name AS menu_item_name,
       COUNT(oi.menu_item_id) AS total_orders
FROM order_items oi
         JOIN menu m ON oi.menu_item_id = m.id
GROUP BY m.id, m.name
ORDER BY total_orders DESC
LIMIT '%s';

-- get_top_menu_items_revenue
SELECT
    m.id AS menu_item_id,
    m.name AS menu_item_name,
    SUM(m.price) AS total_revenue
FROM order_items oi
         JOIN menu m ON oi.menu_item_id = m.id
GROUP BY m.id, m.name
ORDER BY total_revenue DESC
LIMIT '%s';

-- get_periodic_revenue
SELECT
    oi.menu_item_id AS menu_item_id,
    SUM(m.price) AS revenue
FROM order_items oi
         JOIN orders o ON oi.id = o.id
         JOIN menu m ON oi.menu_item_id = m.id
WHERE
    o.order_time BETWEEN '%s' AND '%s'
GROUP BY oi.menu_item_id
ORDER BY revenue DESC;

-- get_periodic_orders
SELECT
    oi.menu_item_id AS menu_item_id,
    COUNT(oi.menu_item_id) AS total_orders
FROM order_items oi
         JOIN orders o ON oi.id = o.id
WHERE
    o.order_time BETWEEN '%s' AND '%s'
GROUP BY oi.menu_item_id
ORDER BY total_orders DESC;

-- get_top_payment_methods
SELECT
    o.payment_method,
    COUNT(o.payment_method) AS total_orders
FROM orders o
GROUP BY o.payment_method
ORDER BY total_orders DESC;

-- get_most_valuable_customers_revenue
SELECT
    c.id AS customer_id,
    SUM(o.price) AS money_spent
FROM orders o JOIN customers c ON c.id = o.customer_id
GROUP BY c.id
ORDER BY money_spent DESC
LIMIT '%s';

-- get_most_valuable_customers_orders
SELECT
    c.id AS customer_id,
    COUNT(o.employee_id) AS total_orders
FROM orders o JOIN customers c ON c.id = o.customer_id
GROUP BY c.id
ORDER BY total_orders DESC
LIMIT '%s';

-- get_orders_from_customer
SELECT *
    FROM orders o
WHERE o.customer_id = '%s';

-- clock_out_employee
UPDATE employees
SET is_clockedin = false
WHERE employees.id = '%s';

-- clock_in_employee
UPDATE employees
SET is_clockedin = true, last_clockin = NOW()
WHERE employees.id = '%s';

-- get_top_ingredients
SELECT
    i.id AS ingredient_id,
    COUNT(oi.menu_item_id) AS total_usage
FROM order_items oi
         JOIN menu_ingredients mi ON oi.menu_item_id = mi.menu_item
         JOIN inventory i ON mi.ingredient_id = i.id
         JOIN orders o ON oi.order_id = o.id
GROUP BY i.id, i.name
ORDER BY total_usage DESC
LIMIT '%s';

-- get_top_ingredients_periodic
SELECT
    i.id AS ingredient_id,
    COUNT(oi.menu_item_id) AS total_usage
FROM order_items oi
         JOIN menu_ingredients mi ON oi.menu_item_id = mi.menu_item
         JOIN inventory i ON mi.ingredient_id = i.id
         JOIN orders o ON oi.order_id = o.id
WHERE o.order_time BETWEEN '%s' AND '%s'
GROUP BY i.id, i.name
ORDER BY total_usage DESC
LIMIT '%s';

-- get_top_days_revenue
SELECT
    DATE(o.order_time) AS order_day,
    SUM(o.price) AS revenue
FROM orders o
GROUP BY order_day
ORDER BY revenue DESC
LIMIT '%s';

-- get_top_days_total_orders
SELECT
    DATE(o.order_time) AS order_date,
    EXTRACT(HOUR FROM o.order_time) AS order_hour,
    COUNT(o.id) AS total_orders
FROM orders o
GROUP BY order_hour, o.order_time
ORDER BY order_date DESC
LIMIT 10;

-- get_sales_history
SELECT
    DATE_TRUNC('hour', o.order_time) AS order_hour,
    COUNT(o.id) AS total_orders,
    SUM(o.price) AS total_revenue
FROM orders o
WHERE o.order_time BETWEEN '%s' AND '%s'
GROUP BY order_hour
ORDER BY order_hour DESC;

-- get_all_time_sales_history
SELECT
    DATE_TRUNC('week', o.order_time) AS order_week,
    COUNT(o.id) AS total_orders,
    SUM(o.price) AS total_revenue
FROM orders o
GROUP BY order_week
ORDER BY order_week;

-- update_ingredient_amount
UPDATE inventory i SET amount = amount + '%s' WHERE i.id = '%s';

-- get_previous_orders
SELECT
    *
FROM orders o
WHERE o.order_time BETWEEN '2024-01-01' AND '%s'
GROUP BY o.id
ORDER BY o.order_time DESC
LIMIT '%s';

-- get_orders_timeframe
SELECT
    *
FROM orders o
WHERE
    o.order_time BETWEEN '%s' AND '%s'
ORDER BY o.order_time DESC;

-- add_order
INSERT INTO orders (customer_id, price, payment_method, employee_id, order_time)
VALUES ('%s', '%s', '%s', '%s', '%s');

-- add_item_sold
INSERT INTO order_items (order_id, menu_item_id)
VALUES ('%s', '%s');

-- add_order_inventory
INSERT INTO order_inventory (order_id, inventory_id)
VALUES ('%s', '%s');

-- get_all_ingredients
SELECT * FROM inventory;

-- add_new_ingredient_inventory
INSERT INTO inventory(name, serving_price, amount, price_batch)
VALUES ('%s', '%s', '%s', '%s');

-- remove_ingredient_inventory
DELETE FROM inventory WHERE inventory.id = '%s';

-- remove_menu_item
DELETE FROM menu WHERE menu.id = '%s';

-- remove_menu_ingredients_menu_id
DELETE FROM menu_ingredients WHERE menu_ingredients.menu_item = '%s';

-- edit_ingredient_inventory
UPDATE inventory SET serving_price = '%s', amount = '%s', price_batch = '%s', name = '%s'
WHERE id = '%s';

-- remove_menu_item
DELETE FROM menu WHERE menu.id = '%s';

-- remove_menu_ingredient
DELETE FROM menu_ingredients WHERE menu_ingredients.menu_item = '%s';

-- update_employee
UPDATE employees SET username = '%s', pass = '%s', position = '%s', is_clockedin = '%s'
WHERE id = '%s';

-- add_employee
INSERT INTO employees(username, pass, position, is_clockedin)
VALUES ('%s', '%s', '%s', '%s');

-- remove_employee
DELETE FROM employees WHERE employees.id = '%s';

