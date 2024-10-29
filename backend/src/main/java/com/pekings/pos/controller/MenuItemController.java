package com.pekings.pos.controller;

import com.pekings.pos.entities.MenuIngredient;
import com.pekings.pos.entities.MenuItem;
import com.pekings.pos.repository.MenuIngredientRepository;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.service.MenuIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menuitem")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuIngredientService menuIngredientService;

    @GetMapping("/{id}")
    public MenuItem getMenuItem(@PathVariable("id") int id) {
        return menuItemRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/ingredients")
    public List<MenuIngredient> getIngredients(@PathVariable("id") int id) {
        return menuIngredientService.getIngredientsByMenuItemId(id);
    }

}
