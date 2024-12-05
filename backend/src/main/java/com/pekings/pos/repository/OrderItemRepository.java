package com.pekings.pos.repository;

import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.util.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

/**
 * Repository interface for performing CRUD operations on {@link OrderItem} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods and includes custom query methods.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    /**
     * Retrieves all order items associated with a specific order.
     *
     * @param orderId The ID of the order whose items are to be retrieved.
     * @return A list of {@link OrderItem} entities linked to the specified order.
     */
    List<OrderItem> findByOrderId(Integer orderId);

    /**
     * Retrieves the top-selling menu items within a specified time period.
     *
     * The query calculates sales statistics by:
     * - Counting how many times each menu item was ordered.
     * - Calculating the total revenue generated by each menu item.
     * - Grouping results by menu item ID and name.
     * - Sorting the results by total revenue in descending order.
     *
     * @param startDate The start date of the time range to analyze (inclusive).
     * @param endDate   The end date of the time range to analyze (inclusive).
     * @return A list of {@link SaleItem} objects, each containing the menu item ID, name, order count, and total revenue.
     */
    @Query("SELECT" +
            "    m.id AS menuItemID," +
            "    m.name AS name," +
            "    COUNT(oi.menuItem.id) AS totalOrders, " +
            "    SUM(m.price) AS totalRevenue" +
            "    FROM OrderItem oi JOIN MenuItem m ON oi.menuItem.id = m.id" +
            "    WHERE oi.order.time BETWEEN :startDate AND :endDate" +
            "    GROUP BY m.id, m.name " +
            "    ORDER BY totalRevenue DESC")
    List<SaleItem> getTopMenuItemPeriodic(@Param("startDate") Instant startDate,
                                          @Param("endDate") Instant endDate);
}
