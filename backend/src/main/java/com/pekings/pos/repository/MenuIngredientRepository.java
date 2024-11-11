package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuIngredientRepository extends JpaRepository<MenuIngredient, Integer> {

    List<MenuIngredient> findByMenuItemId(Integer menuItemId);

}