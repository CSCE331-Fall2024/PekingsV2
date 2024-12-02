package com.pekings.pos.util;

/**
 * Projection interface for representing sales history data.
 * Used to retrieve aggregated sales statistics such as hourly order counts and revenue.
 */
public interface SaleHistoryItem {

    /**
     * Gets the hour of the day for the sales data.
     *
     * @return The hour (0-23) as an integer, representing the time of day.
     */
    int getHour();

    /**
     * Gets the total number of orders placed during the specified hour.
     *
     * @return The number of orders as an integer.
     */
    int getOrders();

    /**
     * Gets the total revenue generated during the specified hour.
     *
     * @return The total revenue as a double.
     */
    double getRevenue();
}
