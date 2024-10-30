package com.pekings.pos.controller;

import com.pekings.pos.entities.Inventory;
import com.pekings.pos.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(("/api/inventory"))
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping("/all")
    public List<Inventory> getAllIngredients() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Inventory getIngredient(@PathVariable("id") int id) {
        return inventoryRepository.findById(id).orElse(null);
    }

}
