-- Adds to the menu_ingredients Junction table
-- This table is the connection between Menu and Inventory
-- It lets us know what ingredients (from the inventory) each menu item needs
-- For instance, a menu item Beef Fried Rice requires inventory items beef and rice

-- Yes, this is GPT generated

-- Small Fountain Drink
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (31, 3, 1);

-- Medium Fountain Drink
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (32, 4, 1);

-- Large Fountain Drink
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (33, 5, 1);

-- Chicken Fried Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (1, 6, 1); -- Carrots
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (2, 6, 1); -- Peas
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 6, 1); -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 6, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (5, 6, 1); -- MSG
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 6, 1); -- Chicken

-- Beef Fried Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (1, 7, 1); -- Carrots
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (2, 7, 1); -- Peas
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 7, 1); -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 7, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (5, 7, 1); -- MSG
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (9, 7, 1); -- Beef

-- Shrimp Fried Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (1, 8, 1); -- Carrots
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (2, 8, 1); -- Peas
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 8, 1); -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 8, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (5, 8, 1); -- MSG
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (10, 8, 1); -- Shrimp

-- Chicken Lo Mein
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (6, 9, 1); -- Cabbage
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (7, 9, 1); -- Egg Noodles
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 9, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 9, 1); -- Chicken

-- Beef Lo Mein
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (6, 10, 1); -- Cabbage
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (7, 10, 1); -- Egg Noodles
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 10, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (9, 10, 1); -- Beef

-- Shrimp Lo Mein
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (6, 11, 1); -- Cabbage
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (7, 11, 1); -- Egg Noodles
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 11, 1); -- Soy Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (10, 11, 1); -- Shrimp

-- Broccoli & Beef Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (11, 12, 1); -- Broccoli
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (9, 12, 1); -- Beef
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 12, 1); -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (4, 12, 1); -- Soy Sauce

-- Orange Chicken Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (13, 13, 1); -- Oranges
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 13, 1); -- Chicken
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 13, 1); -- Rice

-- Chicken Egg Roll
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (14, 14, 1); -- Egg Roll Wrapper
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 14, 1); -- Chicken
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (6, 14, 1); -- Cabbage
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (1, 14, 1); -- Carrots
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (15, 14, 1); -- Onions

-- Veggie Egg Roll
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (14, 15, 1); -- Egg Roll Wrapper
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (6, 15, 1); -- Cabbage
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (1, 15, 1); -- Carrots
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (15, 15, 1); -- Onions

-- Beijing Beef Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (9, 16, 1); -- Beef
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (16, 16, 1); -- Red Pepper
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (15, 16, 1); -- Onions
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 16, 1); -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (17, 16, 1); -- Beijing Beef Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (26, 16, 1); -- Garlic

-- Teriyaki Chicken Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (18, 17, 1); -- Teriyaki Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 17, 1); -- Chicken
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 17, 1); -- Rice

-- 2 Crab Rangoons
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (19, 18, 1); -- Crab
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (20, 18, 1); -- Wonton Wrapper

-- Fortune Cookie
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (21, 19, 1); -- Flour
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (22, 19, 1); -- Sugar
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (23, 19, 1); -- Butter

-- Special PeKing Duck & Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (24, 20, 1); -- Chinese 5 Spice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (25, 20, 1); -- Duck
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 20, 1); -- Rice

-- Pepper Chicken Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 21, 1);  -- Chicken
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (27, 21, 1); -- Pepper
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (16, 21, 1); -- Red Pepper
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (15, 21, 1); -- Onion
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 21, 1);  -- Rice

-- Sweet & Sour Chicken Rice Bowl
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (30, 22, 1); -- Sweet & Sour Sauce
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (3, 22, 1);  -- Rice
INSERT INTO menu_ingredients (ingredient_id, menu_item, ingredients_in_item) VALUES (8, 22, 1);  -- Chicken
