
-- inserting 1000 customers
INSERT INTO customers (id)
SELECT nextval(pg_get_serial_sequence('customers', 'id'))
FROM generate_series(1, 1000);

--- menu table is just:
-- INSERT INTO menu (name,price) VALUES ('example', 420.69)

-- Inserting ingredients
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Carrots', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Peas', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Rice', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Soy Sauce', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('MSG', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Cabbage', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Egg Noodles', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Chicken', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Beef', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Shrimp', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Broccoli', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Steamed Rice', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Oranges', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Egg Roll Wrappers', 1.0, 1000, 500.0);1
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Onion', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Red Pepper', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Beijin Beef Sauce', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Teriyaki Sauce', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Crab', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Wonton Wrapper', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Flour', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Sugar', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Butter', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Chinese 5 Spice', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Duck', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Garlic', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Pepper', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Red Pepper', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Steak', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Sweet & Sour Sauce', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Small cup', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Medium cup', 1.0, 1000, 500.0);
--INSERT INTO inventory (name, serving_price, amount, price_batch) VALUES ('Large cup', 1.0, 1000, 500.0);

-- employees added
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('ThomasC', 'CC137', 'employee','00:00:00',false);
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('Fabio', 'thebatcave', 'employee','00:00:00',true);
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('Germ', 'Machamp', 'employee','00:00:00',false);
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('NathanL', 'meltmyeyes', 'employee','00:00:00',true);
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('NathanM', 'yourboi', 'employee','00:00:00',false);
--- INSERT INTO employees (username,pass,position,last_clockin,is_clockedin) VALUES ('Yasuo', 'hasagi', 'manager','00:00:00',false);