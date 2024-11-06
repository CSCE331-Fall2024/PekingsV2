package com.pekings.pos.repository;

import com.pekings.pos.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(Integer customerID);

    List<Order> findByEmployeeId(Integer employeeID);

}