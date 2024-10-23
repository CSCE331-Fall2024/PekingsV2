package com.pekings.pos.storage;

import com.pekings.pos.object.*;
import com.pekings.pos.util.SaleHistoryItem;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author ceeedric
 *
 * Data access object providing a bridge between business logic and
 * DB. This interface is the only way available to fetch and update
 * date in the DB
 */
public interface Repository {

    /**
     * Adds a menu item to the DB. The required
     * MenuItem must have a list of ingredients ready to
     * go as well as their IDs.
     * You may omit the ID field in MenuItem, but not everywhere else
     *
     * @param menuItem Complete menu item object
     */
    void addMenuItem(MenuItem menuItem);

    /**
     * Deletes a menu item. This method also deletes
     * entries in tables dependent to menu items.
     * This does not delete orders that contain the item,
     * but it can cause these orders to have "ghost items"
     *
     * @param menuItemID Complete menu item object
     */
    void deleteMenuItem(int menuItemID);

    /**
     * Returns a menu item based on its id
     *
     * @param itemID - The ID of the requested item
     * @return - Filled out MenuItem object
     */
    MenuItem getMenuItem(int itemID);

    /**
     * Edits the menu item with the properties inside the
     * provided MenuItem object
     *
     * @param menuItem the MenuItem object with the original id and new fields
     */
    void updateMenuItem(MenuItem menuItem);

    /**
     * Get all MenuItems purchased within an order
     *
     * @param orderID The ID of the order requested
     * @return A list of the menu items purchased in the order
     */
    List<MenuItem> getOrderItems(int orderID);

    /**
     * Get the total income for a specific day
     *
     * @param date The day to get income from
     * @return The total income as a decimal
     */
    double getDailyIncome(Date date);

    /**
     * Get the total income for a specific week. This
     * method adds 7 days to the date provided
     *
     * @param startOfWeek The first day of the week
     * @return The total income as a decimal
     */
    double getWeeklyIncome(Date startOfWeek);

    /**
     * Get the total income for a specific week. This
     * method uses Java standard library to find the next month
     * accounting for 30 and 31 day month.
     *
     * @param startOfMonth The day to count from
     * @return The total income as a decimal
     */
    double getMonthlyIncome(Date startOfMonth);

    /**
     * Get income for a specific period of time, of any length
     *
     * @param from The day to count from
     * @param to The day to count to
     * @return The total income as a decimal
     */
    double getIncome(Date from, Date to);

    /**
     * Get active employees. An active employee is
     * one whose "active" field in the DB is true
     *
     * @return List of active employees
     */
    List<Employee> getActiveEmployees();

    /**
     * Retrieve all employees, regardless of active state
     *
     * @return List of all employees
     */
    List<Employee> getEmployees();

    /**
     * Retrieve all menu items, regardless whether they are active or not
     *
     * @return A list of all menu items
     */
    Set<MenuItem> getMenuItems();

    /**
     * Get an ingredient based on its ID
     * Ingredient ID is available on the inventory table
     *
     * @param id Id of ingredient to retrieve
     * @return Filled out ingredient object
     */
    Ingredient getIngredient(int id);

    /**
     * Retrieve the menu items that have generated most revenue
     *
     * @param topWhat Limit of entries. If topWhat is 5, then only the top 5 items will be returned
     * @return A map with the MenuItem and their corresponding revenue
     */
    Map<MenuItem, Double> getTopMenuItemsRevenue(int topWhat);

    /**
     * Retrieve the menu items that were purchased the most
     *
     * @param topWhat Limit of entries. If topWhat is 5, then only the top 5 items will be returned
     * @return A map with the MenuItem and the corresponding amount of times they were ordered
     */
    Map<MenuItem, Integer> getTopMenuItemsOrders(int topWhat);

    /**
     * Retrieve the menu items that generated the most revenue, but
     * in a specific period of time.
     *
     * @param from The start of the period
     * @param to The end of the period
     * @return The top menu items and their corresponding revenue
     */
    Map<MenuItem, Double> getTopMenuItemsRevenue(Date from, Date to);

    /**
     * Retrieve the most purchased items, but
     * in a specific period of time
     *
     * @param from The start of the period
     * @param to The end of the period
     * @return The most popular items and the corresponding amount of orders
     */
    Map<MenuItem, Integer> getTopMenuItemsOrders(Date from, Date to);

    /**
     * Retrieve all ingredients a menu item requires
     *
     * @param menuItemID The menu item ID to fetch from
     * @return A list of ingredients required by the menu item
     */
    List<Ingredient> getIngredients(int menuItemID);

    /**
     * Retrieve a list of all available ingredients
     *
     * @return A list containing all available ingredients
     */
    List<Ingredient> getAllIngredients();

    /**
     * Retrieves the most popular payment methods
     *
     * @return A map containing the payment method and the amount of times it was used
     */
    Map<String, Integer> getTopPaymentMethods();

    /**
     * This function returns the customer IDs of the
     * customers that have spent the most money
     *
     * @param topWhat Limit of customers to show. If this is 5, then this method returns the top 5 most spending customers
     * @return A map of customers and the corresponding revenue generated from them
     */
    Map<Customer, Double> getTopCustomersRevenue(int topWhat);

    /**
     * This function returns the customer IDs of the
     * customers that have ordered the most
     *
     * @param topWhat Limit of customers to show. If this is 5, then this method returns the top 5 most ordering customers
     * @return A map of customers and their corresponding amount of items ordered
     */
    Map<Customer, Integer> getTopCustomersOrders(int topWhat);

    /**
     * Retrieve all the orders made by a specific customer
     *
     * @param customerID The ID of the customer to fetch from
     * @return The list of orders made by that customer
     */
    List<Order> getOrders(int customerID);

    /**
     * Retrieves the customer based on its ID
     *
     * @param customerID The ID to retrieve from
     * @return A customer object with available data
     */
    Customer getCustomer(int customerID);

    /**
     * Set an employee's active field to true
     *
     * @param employeeID The employee to set active
     */
    void clockIn(int employeeID);

    /**
     * Set an employee's active field to false
     *
     * @param employeeID The employee to set inactive
     */
    void clockOut(int employeeID);

    /**
     * Retrieve the most popular ingredients
     *
     * @param topWhat Limit of entries to show. If this is 5, then this method returns the top 5 most popular ingredients
     * @return A map of ingredients and the corresponding amount it was used
     */
    Map<Ingredient, Integer> getTopIngredients(int topWhat);

    /**
     * Retrieves the most popular ingredients, based on a period of time
     *
     * @param from The start of the period
     * @param to End of the period
     * @param topWhat Limit of entries to show. If this is 5, then this method returns the top 5 most used ingredients in that period
     * @return A map of the ingredients and the corresponding amount it was used
     */
    Map<Ingredient, Integer> getTopIngredients(Date from, Date to, int topWhat);

    /**
     * Retrieves the days with most revenue
     *
     * @param topWhat Limit of entries to show. If this is 5, then this returns the top 5 most money-making days
     * @return A map of dates and their corresponding revenue
     */
    Map<Date, Double> getTopDatesRevenue(int topWhat);

    /**
     * Retrieves the days with most orders placed
     *
     * @param topWhat Limit of entries to show. If this is 5, then this returns the top 5 busiest days
     * @return A map of dates and their corresponding amount of orders placed
     */
    Map<Date, Integer> getTopDatesTotalOrders(int topWhat);

    /**
     * Retrieves all sales, in a per-hour basis based on a period
     * This method returns a SaleHistoryItem object. This object stores
     * the time of the order as a Timestamp, as well as the revenue and the total
     * orders placed in the period it represents.
     * In this method, each SaleHistoryItem represents a one-hour block
     *
     * @param from Start of the period
     * @param to End of the period
     * @return A list of SaleHistoryItem with all the order on that period
     */
    List<SaleHistoryItem> getSalesHistory(Date from, Date to);

    /**
     * Get all time sales history, on a per-week basis
     * @see Repository#getSalesHistory for more information on SaleHistoryItem
     *
     * @return A list of SaleHistoryItem on a per-week basis, based on all orders in the DB
     */
    List<SaleHistoryItem> getAllTimeSalesHistory();

    /**
     * Adds ingredients to the stock
     *
     * @param ingredientID The ingredient ID to add to
     * @param amount Amount to add
     */
    void addIngredientStock(int ingredientID, int amount);

    /**
     * Subtracts ingredients to the stock
     *
     * @param ingredientID The ingredient ID to subtract from
     * @param amount Amount to subtract
     */
    void removeIngredientStock(int ingredientID, int amount);

    /**
     * Retrieves all the orders before a certain date
     *
     * @param date Date to start from
     * @param limit Limit of entries. If limit is 100, then this method returns the most recent 100 orders based on the date given
     * @return A list of orders of limit most recent orders
     */
    List<Order> getOrdersBefore(Date date, int limit);

    /**
     * Similar to getOrdersBefore, but returns all dates within the period
     *
     * @see Repository#getOrdersBefore(Date, int)
     *
     * @param from Start of the period
     * @param to End of the period
     * @return The list of all orders within the specified period
     */
    List<Order> getOrders(Date from, Date to);

    /**
     * Adds an order to the DB. This method also handles all extra operations of
     * inserting into the relevant junction tables and updating necessary inventory entries
     *
     * @param order The order to be inserted. The field ID can be omitted as it is handled by the implementation.
     */
    void addOrder(Order order);

    /**
     * Adds an entirely new ingredient to the inventory table
     * The ID field can be omitted in this and other insert operations
     *
     * @param ingredient Ingredient object with the relevant details
     */
    void addNewIngredientInventory(Ingredient ingredient);

    /**
     * Updates an ingredient on the inventory table. This can mean
     * setting the amount, name, etc. ID field must be valid.
     *
     * @param ingredient The ingredient to update
     */
    void updateIngredientInventory(Ingredient ingredient);

    /**
     * Entirely deletes an ingredient from the Database
     * This method does not delete menu items that may have use
     * deleted ingredients. Be careful using this!
     *
     * @param ingredientID The ingredient ID to be deleted
     */
    void deleteIngredientInventory(int ingredientID);

    /**
     * Adds an employee
     * The ID field can be omitted in this and other insert operations
     *
     * @param employee The employee to add
     */
    void addEmployee(Employee employee);

    /**
     * Removes an employee from the DB
     * This method does not delete orders made by the employee
     *
     * @param id Employee ID to be removed
     */
    void removeEmployee(int id);

    /**
     * Updates employee table with provided fields.
     * The ID field cannot be omitted and the Employee
     * instance must hold an existing employee ID
     *
     * @param employee The employee to update
     */
    void updateEmployee(Employee employee);

    /**
     * Removes a menu item
     * NOT RECOMMENDED! Only use this if absolutely necessary.
     * If you simply intend to deactivate a menu item and prevent
     * it from being displayed, then set the MenuItem's active field to false
     * @see Repository#updateMenuItem(MenuItem)
     *
     * @param id The menu item id to remove
     */
    void removeMenuItem(int id);

}
