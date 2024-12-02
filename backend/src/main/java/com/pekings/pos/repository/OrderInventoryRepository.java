package com.pekings.pos.repository;

import com.pekings.pos.entities.OrderInventory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for performing CRUD operations on {@link OrderInventory} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods.
 */
public interface OrderInventoryRepository extends JpaRepository<OrderInventory, Integer> {
    // No additional methods are defined; inherits default JpaRepository methods.
}
