package com.pekings.pos.repository;

import com.pekings.pos.entities.OrderInventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderInventoryRepository extends JpaRepository<OrderInventory, Integer> {
}