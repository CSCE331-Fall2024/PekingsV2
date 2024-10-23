--DROP TABLE IF EXISTS "customers";
--DROP TABLE IF EXISTS "employees";
--DROP TABLE IF EXISTS "orders";
--DROP TABLE IF EXISTS "menu";
--DROP TABLE IF EXISTS "inventory";
--DROP TABLE IF EXISTS "menu_ingredients";
--DROP TABLE IF EXISTS "individual_items";

CREATE TABLE "customers" (
    id SERIAL PRIMARY KEY
);

CREATE TABLE "employees" (
    id SERIAL PRIMARY KEY,
    username TEXT,
    pass TEXT,
    position TEXT,
    last_clockin TIME, --timestamp
    is_clockedin BOOLEAN
);

CREATE TABLE "orders" (
    id SERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    price DECIMAL,
    payment_method TEXT,
    employee_id BIGINT NOT NULL,
    order_time TIMESTAMP,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE "order_items" (
    id SERIAL PRIMARY KEY,
    order_id INT,
    menu_item_id INT,
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES menu_ingredients(id)
);


CREATE TABLE "menu" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price DECIMAL,
    active BOOLEAN
);

-- List of ingredients for each menu item
-- This is how we know how many of what to remove from the inventory
-- Inventory removal is done in Java code. There are no SQL functions in the DB
CREATE TABLE "menu_ingredients" (
    id SERIAL PRIMARY KEY,
    ingredient_id INT,
    menu_item INT,
    ingredients_in_item INT,
    CONSTRAINT fk_item FOREIGN KEY (menu_item) REFERENCES menu(id),
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredient_id) REFERENCES inventory(id)
);

CREATE TABLE "order_inventory" (
    id SERIAL PRIMARY KEY,
    order_id INT,
    inventory_id INT,
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_inventory_id FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name TEXT,
    serving_price DECIMAL,
    amount INT,
    price_batch DECIMAL
);

-- INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Carrots', 1.0, 1000, 500.0);
