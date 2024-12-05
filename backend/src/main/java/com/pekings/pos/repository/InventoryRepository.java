package com.pekings.pos.repository;

import com.pekings.pos.entities.Inventory;
import com.pekings.pos.util.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

/**
 * Repository interface for performing CRUD operations on {@link Inventory} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods and includes custom query methods.
 */
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    /**
     * Retrieves the most used inventory items (ingredients) within a specified time period.
     *
     * The query calculates usage by:
     * - Counting how many times a menu item's ingredients were included in orders.
     * - Grouping results by inventory item ID and name.
     * - Sorting the results by total usage in descending order.
     *
     * @param startDate The start date of the time range to analyze (inclusive).
     * @param endDate   The end date of the time range to analyze (inclusive).
     * @return A list of {@link InventoryItem} objects, each representing an ingredient and its usage count.
     */
    @Query("SELECT" +
            "    i.id AS ingredientId," +
            "    COUNT(oi.menuItem.id) AS totalUsage" +
            "    FROM OrderItem oi" +
            "         JOIN MenuIngredient mi ON oi.menuItem.id = mi.menuItem.id" +
            "         JOIN Inventory i ON mi.ingredient.id = i.id" +
            "         JOIN Order o ON oi.order.id = o.id" +
            "    WHERE o.time BETWEEN :startDate AND :endDate" +
            "    GROUP BY i.id, i.name" +
            "    ORDER BY totalUsage DESC")
    List<InventoryItem> findTopIngredientsPeriodic(@Param("startDate") Instant startDate,
                                                   @Param("endDate") Instant endDate);
}
