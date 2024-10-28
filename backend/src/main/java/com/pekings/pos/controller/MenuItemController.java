package com.pekings.pos.controller;

import com.pekings.pos.entities.MenuItem;
import com.pekings.pos.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menuitem")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping("/{id}")
    public MenuItem getMenuItem(@PathVariable("id") int id) {
        return menuItemRepository.findById(id).orElse(null);
    }

}
