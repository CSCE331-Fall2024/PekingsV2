package com.pekings.pos.controller;

import com.pekings.pos.entities.Inventory;
import com.pekings.pos.repository.InventoryRepository;
import com.pekings.pos.util.DateUtil;
import com.pekings.pos.util.InventoryItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
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

    /**
     * Gets the most popular ingredients within a time period
     * Sample request: /api/inventory/top?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
     * Format: startDate=2024-01-01T00:00:00Z
     *
     * @param startDate the date to start from
     * @param endDate the date to stop fetching
     * @return the most used ingredients within the given timeframe
    */
    @GetMapping("/top")
    public List<InventoryItem> getTopIngredientsPeriodic(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        if (startDate == null && endDate == null)
            return inventoryRepository.findTopIngredientsPeriodic(DateUtil.startOfData(), DateUtil.endOfData());

        return inventoryRepository.findTopIngredientsPeriodic(startDate, endDate);
    }

    @PatchMapping("/update")
    public Inventory updateIngredient(@RequestBody Inventory inventory) {

        if (inventory.getId() == null)
            return null;

        return inventoryRepository.save(inventory);
    }

    @PatchMapping("/update/stock/{id}")
    public Inventory updateStock(@PathVariable("id") int id, @RequestParam("amount") int amount) {
        Inventory inventory = inventoryRepository.findById(id).orElse(null);

        if (inventory == null)
            return null;

        inventory.setAmount(inventory.getAmount() + amount);
        return inventoryRepository.save(inventory);
    }

    @PostMapping("/add")
    public Inventory addIngredient(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @DeleteMapping("/delete")
    public void deleteIngredient(@RequestBody int id) {
        inventoryRepository.deleteById(id);
    }
}
