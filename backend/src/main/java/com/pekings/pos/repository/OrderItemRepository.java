package com.pekings.pos.repository;

import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.util.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrderId(Integer menuItemId);

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