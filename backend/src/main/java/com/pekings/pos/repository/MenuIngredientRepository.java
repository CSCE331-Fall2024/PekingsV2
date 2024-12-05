package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository interface for performing CRUD operations on {@link MenuIngredient} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods and includes custom query methods.
 */
public interface MenuIngredientRepository extends JpaRepository<MenuIngredient, Integer> {

    /**
     * Finds all menu ingredients associated with a specific menu item.
     *
     * @param menuItemId The ID of the menu item whose ingredients are to be retrieved.
     * @return A list of {@link MenuIngredient} entities linked to the specified menu item.
     */
    List<MenuIngredient> findByMenuItemId(Integer menuItemId);
}
