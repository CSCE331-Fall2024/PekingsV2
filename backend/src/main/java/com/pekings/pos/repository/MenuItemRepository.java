package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository interface for performing CRUD operations on {@link MenuItem} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods and includes custom query methods.
 */
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    /**
     * Finds all menu items belonging to a specific category.
     *
     * @param category The category to filter menu items by (e.g., "dessert", "drink").
     * @return A list of {@link MenuItem} entities matching the specified category.
     */
    List<MenuItem> findByCategory(String category);
}
