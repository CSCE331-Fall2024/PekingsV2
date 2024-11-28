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

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(Integer customerID);

    List<Order> findByEmployeeId(Integer employeeID);

    @Query("SELECT o FROM Order o WHERE o.time >= :startTime AND o.time <= :endTime")
    List<Order> findByTimeRange(@Param("startTime") Instant startTime, @Param("endTime") Instant endTime, Pageable pageable);

    List<Order> findByStatus(String status);


    @Query("SELECT" +
            "    EXTRACT(HOUR FROM o.time) AS hour," +
            "    COUNT(o.id) AS orders," +
            "    SUM(o.price) AS revenue" +
            "    FROM Order o" +
            "    WHERE o.time BETWEEN :startDate AND :endDate" +
            "    GROUP BY hour")
    List<SaleHistoryItem> getRevenueAndOrdersPeriodic(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}