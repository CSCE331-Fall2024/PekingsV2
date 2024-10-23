package com.pekings.pos.storage;

import com.pekings.pos.object.*;
import com.pekings.pos.util.SaleHistoryItem;
import com.pekings.pos.util.ThrowingConsumer;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.*;
import java.sql.Date;
import java.util.*;

public class PersistentRepository implements Repository {

    private Connection conn;
    private QueryLoader queryLoader;

    private static final String DB_USERNAME = "pekings_01";
    private static final String DB_PASSWORD = "uD37k2)R1Kp}";
    private static final String DB_NAME = "csce331_950_pekings_db";
    private static final String DB_ADDRESS = "csce-315-db.engr.tamu.edu";
    private static final String DB_PORT = "5432";

    public void initialize() throws SQLException, IOException, URISyntaxException {
        System.out.println("Initializing  DB connection...");

        Properties props = new Properties();
        props.setProperty("user", DB_USERNAME);
        props.setProperty("password", DB_PASSWORD);

        conn = DriverManager.getConnection(
                "jdbc:" + "postgresql" + "://" +
                        DB_ADDRESS + ":" + DB_PORT + "/" + DB_NAME, props);

        System.out.println("DB Connected");

        queryLoader = new QueryLoader();
        queryLoader.loadQueries();

        if (conn == null || queryLoader == null)
            throw new SQLException("Could not create connection with PostgreSQL server!");
    }

    public void shutdown() throws SQLException {
        conn.close();
        System.out.println("Closed DB connection");
    }

    @Override
    public void addMenuItem(MenuItem menuItem) {
        String addItemQuery = queryLoader.getQuery("add_menu_item")
                .formatted(menuItem.getName(), menuItem.getPrice());

        performPreparedStatement(preparedStatement -> {
            preparedStatement.execute();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            int menuItemID = -1;
            while (resultSet.next()) {
                menuItemID = resultSet.getInt(1);
            }

            List<String> queries = new ArrayList<>();
            queries.add(addItemQuery);

            for (Ingredient ingredient : menuItem.getIngredients()) {
                String ingredientQuery = queryLoader.getQuery("add_ingredient")
                        .formatted(ingredient.getId() + "", menuItemID + "", ingredient.getAmount() + "");
                queries.add(ingredientQuery);
            }

            performNonFetchQuery(queries.toArray(String[]::new));

        }, addItemQuery, Statement.RETURN_GENERATED_KEYS);
    }

    @Override
    public void deleteMenuItem(int id) {
        List<String> queries = new ArrayList<>();

        String query = queryLoader.getQuery("delete_menu_item")
                .formatted(id + "");

        String ingredientQuery = queryLoader.getQuery("delete_menu_ingredient_menu_item")
                .formatted(id + "");

        queries.add(ingredientQuery);
        queries.add(query);

        performNonFetchQuery(queries.toArray(String[]::new));
    }

    @Override
    public MenuItem getMenuItem(int id) {
        // We need an atomic reference or something weird to create an object that isn't
        // inside the consumer, so just make a list and get the first (and only) element
        List<MenuItem> menuItems = new ArrayList<>();
        performFetchQuery("get_menu_item", resultSet -> {
            int menuID = resultSet.getInt("id");
            String name = resultSet.getString("name");
            float price = resultSet.getFloat("price");
            boolean active = resultSet.getBoolean("active");
            List<Ingredient> ingredients = getIngredients(menuID);

            MenuItem menuItem = new MenuItem(menuID, name, price, ingredients, active);
            menuItems.add(menuItem);
        }, id + "");

        return menuItems.getFirst();
    }

    @Override
    public void updateMenuItem(MenuItem menuItem) {
        String query = queryLoader.getQuery("update_menu_item")
                .formatted(menuItem.getName(), menuItem.getPrice() + "",
                        menuItem.isActive(), menuItem.getId() + "");

        performNonFetchQuery(query);
    }

    @Override
    public List<MenuItem> getOrderItems(int orderID) {
        List<MenuItem> menuItems = new ArrayList<>();
        performFetchQuery("get_menu_item_order", resultSet -> {
            int menuID = resultSet.getInt("menu_item_id");
            MenuItem menuItem = getMenuItem(menuID);
            menuItems.add(menuItem);
        }, orderID + "");
        return menuItems;
    }

    @Override
    public double getDailyIncome(Date date) {
        Date dayAfter = Date.valueOf(date.toLocalDate().plusDays(1));
        return getIncome(date, dayAfter);
    }

    @Override
    public double getWeeklyIncome(Date startOfWeek) {
        Date weekAfter = Date.valueOf(startOfWeek.toLocalDate().plusDays(7));
        return getIncome(startOfWeek, weekAfter);
    }

    @Override
    public double getMonthlyIncome(Date startOfMonth) {
        Date monthAfter = Date.valueOf(startOfMonth.toLocalDate().plusDays(30));
        return getIncome(startOfMonth, monthAfter);
    }

    @Override
    public double getIncome(Date from, Date to) {
        return getTopMenuItemsRevenue(from, to).values().stream().reduce(Double::sum).orElse(-1D);
    }

    @Override
    public List<Employee> getActiveEmployees() {
        List<Employee> employees = new ArrayList<>();
        performFetchQuery("get_active_employees", resultSet -> {
            Employee employee = makeEmployee(resultSet);
            employees.add(employee);
        });

        return employees;
    }

    @Override
    public List<Employee> getEmployees() {
        List<Employee> employees = new ArrayList<>();
        performFetchQuery("get_all_employees", resultSet -> {
            employees.add(makeEmployee(resultSet));
        });

        return employees;
    }

    @Override
    public Set<MenuItem> getMenuItems() {
        Set<MenuItem> menuItems = new HashSet<>();
        performFetchQuery("get_menu_items", resultSet -> {
            int id = resultSet.getInt("menu_item_id");
            String name = resultSet.getString("menu_item_name");
            float price = resultSet.getFloat("menu_item_price");
            boolean active = resultSet.getBoolean("menu_item_active");

            String ingredient_name = resultSet.getString("ingredient_name");
            int quantity = resultSet.getInt("ingredient_quantity");
            int ingredient_batch_price = resultSet.getInt("ingredient_batch_price");
            int ingredient_price = resultSet.getInt("serving_price");
            int ingredient_id = resultSet.getInt("ingredient_id");

            Ingredient ingredient = new Ingredient(ingredient_id, ingredient_name, ingredient_price, quantity, ingredient_batch_price);

            if (menuItems.stream().anyMatch(menuItem -> menuItem.getId() == id)) {
                menuItems.stream().filter(menuItem1 -> menuItem1.getId() == id).findAny()
                        .ifPresent(menuItem -> menuItem.addIngredient(ingredient));
            } else {
                MenuItem menuItem = new MenuItem(id, name, price, new ArrayList<>(), active);
                menuItem.addIngredient(ingredient);
                menuItems.add(menuItem);
            }
        });

        return menuItems;
    }

    @Override
    public Ingredient getIngredient(int id) {
        // We need an atomic reference or something weird to create an object that isn't
        // inside the consumer, so just make a list and get the first (and only) element
        List<Ingredient> ingredients = new ArrayList<>();
        performFetchQuery("get_ingredient", resultSet ->
                ingredients.add(makeIngredient(resultSet)),
                id + "");
        return ingredients.getFirst();
    }

    @Override
    public Map<MenuItem, Double> getTopMenuItemsRevenue(int topWhat) {
        Map<MenuItem, Double> revenue = new HashMap<>();
        performFetchQuery("get_top_menu_items_revenue", resultSet -> {
            int menu_item_id = resultSet.getInt("menu_item_id");
            double totalRevenue = resultSet.getDouble("total_revenue");

            MenuItem menuItem = getMenuItem(menu_item_id);
            revenue.put(menuItem, totalRevenue);
        }, topWhat + "");

        return revenue;
    }

    @Override
    public Map<MenuItem, Integer> getTopMenuItemsOrders(int topWhat) {
        Map<MenuItem, Integer> orders = new HashMap<>();
        performFetchQuery("get_top_menu_items_orders", resultSet -> {
            int menu_item_id = resultSet.getInt("menu_item_id");
            int totalOrders = resultSet.getInt("total_orders");

            MenuItem menuItem = getMenuItem(menu_item_id);
            orders.put(menuItem, totalOrders);
        }, topWhat + "");

        return orders;
    }

    @Override
    public Map<MenuItem, Double> getTopMenuItemsRevenue(Date from, Date to) {
        Map<MenuItem, Double> revenueMap = new HashMap<>();
        performFetchQuery("get_periodic_revenue", resultSet -> {
            MenuItem menuItem = getMenuItem(resultSet.getInt("menu_item_id"));
            double revenue = resultSet.getDouble("revenue");
            revenueMap.put(menuItem, revenue);
        }, from.toString(), to.toString());

        return revenueMap;
    }

    @Override
    public Map<MenuItem, Integer> getTopMenuItemsOrders(Date from, Date to) {
        Map<MenuItem, Integer> revenueMap = new HashMap<>();
        performFetchQuery("get_periodic_orders", resultSet -> {
            MenuItem menuItem = getMenuItem(resultSet.getInt("menu_item_id"));
            int totalOrders = resultSet.getInt("total_orders");
            revenueMap.put(menuItem, totalOrders);
        }, from.toString(), to.toString());

        return revenueMap;
    }

    @Override
    public List<Ingredient> getIngredients(int menuItemID) {
        List<Ingredient> ingredients = new ArrayList<>();
        performFetchQuery("get_menu_item_ingredients", resultSet -> {
            int ingredientID = resultSet.getInt("ingredient_id");
            int amount = resultSet.getInt("ingredients_in_item");

            // we use getIngredient here so that we can get the usual properties
            // then set the amount to the amount needed for the menuItem
            Ingredient ingredient = getIngredient(ingredientID);
            ingredient.setAmount(amount);

            ingredients.add(ingredient);
        }, menuItemID + "");

        return ingredients;
    }

    @Override
    public List<Ingredient> getAllIngredients() {
        List<Ingredient> ingredients = new ArrayList<>();
        performFetchQuery("get_all_ingredients", resultSet -> {
            Ingredient ingredient = makeIngredient(resultSet);
            ingredients.add(ingredient);
        });

        return ingredients;
    }

    @Override
    public Map<String, Integer> getTopPaymentMethods() {
        Map<String, Integer> map = new HashMap<>();
        performFetchQuery("get_top_payment_methods", resultSet -> {
            String paymentMethod = resultSet.getString("payment_method");
            int total_orders = resultSet.getInt("total_orders");
            map.put(paymentMethod, total_orders);
        });

        return map;
    }

    @Override
    public Map<Customer, Double> getTopCustomersRevenue(int topWhat) {
        Map<Customer, Double> revenueMap = new HashMap<>();
        performFetchQuery("get_most_valuable_customers_revenue", resultSet -> {
            int customerID = resultSet.getInt("customer_id");
            double moneySpent = resultSet.getDouble("money_spent");

            Customer customer = getCustomer(customerID);
            revenueMap.put(customer, moneySpent);
        }, topWhat + "");
        return revenueMap;
    }

    @Override
    public Map<Customer, Integer> getTopCustomersOrders(int topWhat) {
        Map<Customer, Integer> totalOrders = new HashMap<>();
        performFetchQuery("get_most_valuable_customers_revenue", resultSet -> {
            int customerID = resultSet.getInt("customer_id");
            int total_orders = resultSet.getInt("total_orders");

            Customer customer = getCustomer(customerID);
            totalOrders.put(customer, total_orders);
        }, topWhat + "");
        return totalOrders;
    }

    @Override
    public List<Order> getOrders(int customerID) {
        List<Order> orders = new ArrayList<>();
        performFetchQuery("get_orders_from_customer", resultSet -> {
            int orderID = resultSet.getInt("id");
            int customerId = resultSet.getInt("customer_id");
            double price = resultSet.getDouble("price");
            String payment_method = resultSet.getString("payment_method");
            int employeeID = resultSet.getInt("employee_id");
            Date date = resultSet.getDate("order_time");

            List<MenuItem> menuItems = getOrderItems(orderID);

            Order order = new Order(orderID, customerId, menuItems, price, payment_method, date, employeeID);
            orders.add(order);
        }, customerID + "");
        return orders;
    }

    @Override
    public Customer getCustomer(int customerID) {
        Customer customer = new Customer(customerID);
        List<Order> orders = getOrders(customerID);
        orders.forEach(customer::addOrder);
        return customer;
    }

    @Override
    public void clockIn(int employeeID) {
        String query = queryLoader.getQuery("clock_in_employee")
                .formatted(employeeID + "");
        performNonFetchQuery(query);
    }

    @Override
    public void clockOut(int employeeID) {
        String query = queryLoader.getQuery("clock_out_employee")
                .formatted(employeeID + "");
        performNonFetchQuery(query);
    }

    @Override
    public Map<Ingredient, Integer> getTopIngredients(int topWhat) {
        Map<Ingredient, Integer> topIngredients = new HashMap<>();
        performFetchQuery("get_top_ingredients", resultSet -> {
            int ingredientID = resultSet.getInt("ingredient_id");
            Ingredient ingredient = getIngredient(ingredientID);
            int usage = resultSet.getInt("total_usage");
            topIngredients.put(ingredient, usage);
        }, topWhat + "");
        return topIngredients;
    }

    @Override
    public Map<Ingredient, Integer> getTopIngredients(Date from, Date to, int topWhat) {
        Map<Ingredient, Integer> topIngredients = new HashMap<>();
        performFetchQuery("get_top_ingredients_periodic", resultSet -> {
            int ingredientID = resultSet.getInt("ingredient_id");
            Ingredient ingredient = getIngredient(ingredientID);
            int usage = resultSet.getInt("total_usage");
            topIngredients.put(ingredient, usage);
        }, from.toString(), to.toString(), topWhat + "");
        return topIngredients;
    }

    @Override
    public Map<Date, Double> getTopDatesRevenue(int topWhat) {
        Map<Date, Double> revenueMap = new HashMap<>();
        performFetchQuery("get_top_days_revenue", resultSet -> {
            Date date = resultSet.getDate("order_day");
            double total_orders = resultSet.getInt("revenue");
        }, topWhat + "");
        return revenueMap;
    }

    @Override
    public Map<Date, Integer> getTopDatesTotalOrders(int topWhat) {
        Map<Date, Integer> revenueMap = new HashMap<>();
        performFetchQuery("get_top_days_revenue", resultSet -> {
            Date date = resultSet.getDate("order_day");
            int total_orders = resultSet.getInt("total_orders");
        }, topWhat + "");
        return revenueMap;
    }

    @Override
    public List<SaleHistoryItem> getSalesHistory(Date from, Date to) {
        List<SaleHistoryItem> salesHistory = new ArrayList<>();
        performFetchQuery("get_sales_history", resultSet -> {
            Timestamp timestamp = resultSet.getTimestamp("order_hour");
            int total_orders = resultSet.getInt("total_orders");
            double revenue = resultSet.getDouble("total_revenue");
            SaleHistoryItem saleHistoryItem = new SaleHistoryItem(timestamp, total_orders, revenue);
            salesHistory.add(saleHistoryItem);
        }, from.toString(), to.toString());
        return salesHistory;
    }

    @Override
    public List<SaleHistoryItem> getAllTimeSalesHistory() {
        List<SaleHistoryItem> salesHistory = new ArrayList<>();
        performFetchQuery("get_all_time_sales_history", resultSet -> {
            Timestamp timestamp = resultSet.getTimestamp("order_week");
            int total_orders = resultSet.getInt("total_orders");
            double revenue = resultSet.getDouble("total_revenue");
            SaleHistoryItem saleHistoryItem = new SaleHistoryItem(timestamp, total_orders, revenue);
            salesHistory.add(saleHistoryItem);
        });
        return salesHistory;
    }

    @Override
    public void addIngredientStock(int ingredientID, int amount) {
        String query = queryLoader.getQuery("update_ingredient_amount")
                .formatted(amount + "", ingredientID + "");
        performNonFetchQuery(query);
    }

    @Override
    public void removeIngredientStock(int ingredientID, int amount) {
        addIngredientStock(ingredientID, -amount);
    }

    @Override
    public List<Order> getOrdersBefore(Date date, int limit) {
        List<Order> orders = new ArrayList<>();
        performFetchQuery("get_previous_orders", resultSet -> {
            int orderID = resultSet.getInt("order_id");
            int customerID = resultSet.getInt("customer_id");
            double price = resultSet.getDouble("price");
            int employeeID = resultSet.getInt("employee_id");
            Date orderTime = resultSet.getDate("order_time");
            String paymentMethod = resultSet.getString("payment_method");

            List<MenuItem> itemsSold = getOrderItems(orderID);
            Order order = new Order(orderID, customerID, itemsSold, price, paymentMethod, orderTime, employeeID);
            orders.add(order);
        });

        return orders;
    }

    @Override
    public List<Order> getOrders(Date from, Date to) {
        List<Order> orders = new ArrayList<>();
        performFetchQuery("get_orders_timeframe", resultSet -> {
            int orderID = resultSet.getInt("order_id");
            int customerID = resultSet.getInt("customer_id");
            double price = resultSet.getDouble("price");
            int employeeID = resultSet.getInt("employee_id");
            Date orderTime = resultSet.getDate("order_time");
            String paymentMethod = resultSet.getString("payment_method");

            List<MenuItem> itemsSold = getOrderItems(orderID);
            Order order = new Order(orderID, customerID, itemsSold, price, paymentMethod, orderTime, employeeID);
            orders.add(order);
        });

        return orders;
    }

    @Override
    public void addOrder(Order order) {

        String addOrderQuery = queryLoader.getQuery("add_order")
                .formatted(order.getCustomerID(), order.getPrice() + "", order.getPaymentMethod(),
                        order.getEmployeeID() + "", order.getPurchaseTime().toString());

        performPreparedStatement(preparedStatement -> {

            preparedStatement.execute();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            int orderID = -1;
            while (resultSet.next()) {
                orderID = resultSet.getInt(1);
            }

            if (orderID == -1) {
                System.out.println("Failed to add order!");
                return;
            }

            List<String> queries = new ArrayList<>();

            for (MenuItem menuItem : order.getItemsSold()) {

                // add order_items
                String addItemSold = queryLoader.getQuery("add_item_sold")
                        .formatted(orderID + "", menuItem.getId() + "");

                queries.add(addItemSold);

                // add to menu_ingredients
                for (Ingredient ingredient : menuItem.getIngredients()) {
                    // remove from inventory
                    String removeInventoryIngredient = queryLoader.getQuery("update_ingredient_amount")
                            .formatted(-ingredient.getAmount(), ingredient.getId() + "");
                    queries.add(removeInventoryIngredient);
                }
            }

            performNonFetchQuery(queries.toArray(String[]::new));
        }, addOrderQuery, Statement.RETURN_GENERATED_KEYS);
    }

    @Override
    public void addNewIngredientInventory(Ingredient ingredient) {
        String query = queryLoader.getQuery("add_new_ingredient_inventory")
                .formatted(ingredient.getName(), ingredient.getPrice(),
                        ingredient.getAmount(), ingredient.getBatchPrice());
        performNonFetchQuery(query);
    }

    @Override
    public void updateIngredientInventory(Ingredient ingredient) {
        String query = queryLoader.getQuery("edit_ingredient_inventory")
                .formatted(ingredient.getPrice() + "", ingredient.getAmount() + "",
                        ingredient.getBatchPrice() + "", ingredient.getName(), ingredient.getId());
        performNonFetchQuery(query);
    }

    @Override
    public void deleteIngredientInventory(int ingredientID) {
        String query = queryLoader.getQuery("remove_ingredient_inventory")
                .formatted(ingredientID + "");
        performNonFetchQuery(query);
    }

    @Override
    public void addEmployee(Employee employee) {
        String add = queryLoader.getQuery("add_employee")
                .formatted(employee.getUsername(), employee.getPassword(),
                        employee.getPosition(), employee.isClockedIn() + "",
                        employee.getId() + "");
        performNonFetchQuery(add);
    }

    @Override
    public void removeEmployee(int id) {
        String delete = queryLoader.getQuery("remove_employee")
                .formatted(id + "");
        performNonFetchQuery(delete);
    }

    @Override
    public void updateEmployee(Employee employee) {
        String update = queryLoader.getQuery("update_employee")
                .formatted(employee.getUsername(), employee.getPassword(),
                        employee.getPosition(), employee.isClockedIn() + "",
                        employee.getId() + "");
        performNonFetchQuery(update);
    }

    @Override
    public void removeMenuItem(int id) {
        String removeMenuIngredient = queryLoader.getQuery("remove_menu_ingredient")
                .formatted(id + "");

        String removeMenuItem = queryLoader.getQuery("remove_menu_item")
                .formatted(id + "");

        performNonFetchQuery(removeMenuIngredient, removeMenuItem);
    }

    public Employee makeEmployee(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String username = resultSet.getString("username");
        String pass = resultSet.getString("pass");
        String position = resultSet.getString("position");
        Time time = resultSet.getTime("last_clockin");
        boolean b = resultSet.getBoolean("is_clockedin");
        return new Employee(id, username, pass, position, time, b);
    }

    public Ingredient makeIngredient(ResultSet resultSet) throws SQLException {
        int ingredientID = resultSet.getInt("id");
        String name = resultSet.getString("name");
        float servingPrice = resultSet.getFloat("serving_price");
        int amount = resultSet.getInt("amount");
        int price_batch = resultSet.getInt("price_batch");
        return new Ingredient(ingredientID, name, servingPrice, amount, price_batch);
    }

    private void performFetchQuery(String query, ThrowingConsumer<ResultSet> forEachItem, String... parameters) {
        try {
            Statement statement = conn.createStatement();
            String s = queryLoader.getQuery(query)
                    .formatted(parameters);
            ResultSet resultSet = statement.executeQuery(s);

            while (resultSet.next()) {
                forEachItem.accept(resultSet);
            }

            resultSet.close();
        } catch (Exception x) {
            throw new RuntimeException(x);
        }
    }

    private void performNonFetchQuery(String... queries) {
        try {
            Statement statement = conn.createStatement();
            for (String query : queries) {
                statement.addBatch(query);
            }

            statement.executeBatch();

            statement.close();
        } catch (Exception x) {
            throw new RuntimeException(x);
        }
    }

    private void performNonFetchQuery(ThrowingConsumer<Statement> consumer) {
        try {
            Statement statement = conn.createStatement();
            consumer.accept(statement);
            statement.close();
        } catch (Exception x) {
            throw new RuntimeException(x);
        }
    }

    private void performPreparedStatement(ThrowingConsumer<PreparedStatement> consumer, String query, int autoGeneratedKeys) {
        try {
            PreparedStatement preparedStatement = conn.prepareStatement(query, autoGeneratedKeys);
            consumer.accept(preparedStatement);
            preparedStatement.close();
        } catch (Exception x) {
            throw new RuntimeException(x);
        }
    }
}
