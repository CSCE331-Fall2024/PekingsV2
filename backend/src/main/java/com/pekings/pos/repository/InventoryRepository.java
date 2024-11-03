package com.pekings.pos.repository;

import com.pekings.pos.entities.Inventory;
import com.pekings.pos.util.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

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