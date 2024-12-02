package com.pekings.pos.repository;

import com.pekings.pos.entities.Order;
import com.pekings.pos.util.SaleHistoryItem;
import com.pekings.pos.util.SaleItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

/**
 * Repository interface for performing CRUD operations on {@link Order} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods and includes custom query methods.
 */
public interface OrderRepository extends JpaRepository<Order, Integer> {

    /**
     * Retrieves all orders associated with a specific customer.
     *
     * @param customerID The ID of the customer.
     * @return A list of {@link Order} entities linked to the specified customer.
     */
    List<Order> findByCustomerId(Integer customerID);

    /**
     * Retrieves all orders associated with a specific employee.
     *
     * @param employeeID The ID of the employee.
     * @return A list of {@link Order} entities linked to the specified employee.
     */
    List<Order> findByEmployeeId(Integer employeeID);

    /**
     * Retrieves orders within a specific time range, with pagination support.
     *
     * @param startTime The start time of the range (inclusive).
     * @param endTime   The end time of the range (inclusive).
     * @param pageable  The pagination details (e.g., page size, page number).
     * @return A paginated list of {@link Order} entities within the specified time range.
     */
    @Query("SELECT o FROM Order o WHERE o.time >= :startTime AND o.time <= :endTime")
    List<Order> findByTimeRange(@Param("startTime") Instant startTime, @Param("endTime") Instant endTime, Pageable pageable);

    /**
     * Retrieves all orders with a specific status.
     *
     * @param status The status to filter orders by (e.g., "completed", "pending").
     * @return A list of {@link Order} entities matching the specified status.
     */
    List<Order> findByStatus(String status);

    /**
     * Retrieves hourly revenue and order statistics within a specified time period.
     *
     * The query calculates:
     * - `hour`: The hour of the day extracted from the order time.
     * - `orders`: The total number of orders placed during that hour.
     * - `revenue`: The total revenue generated during that hour.
     *
     * @param startDate The start date of the time range (inclusive).
     * @param endDate   The end date of the time range (inclusive).
     * @return A list of {@link SaleHistoryItem} projections, each containing hourly statistics.
     */
    @Query("SELECT" +
            "    EXTRACT(HOUR FROM o.time) AS hour," +
            "    COUNT(o.id) AS orders," +
            "    SUM(o.price) AS revenue" +
            "    FROM Order o" +
            "    WHERE o.time BETWEEN :startDate AND :endDate" +
            "    GROUP BY hour")
    List<SaleHistoryItem> getRevenueAndOrdersPeriodic(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
