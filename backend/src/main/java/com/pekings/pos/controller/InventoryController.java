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

/**
 * REST Controller for managing Inventory-related operations.
 * Provides endpoints for CRUD operations and analytics on inventory data.
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    /**
     * Retrieves all ingredients in the inventory.
     *
     * @return A list of all inventory items.
     */
    @GetMapping("/all")
    public List<Inventory> getAllIngredients() {
        return inventoryRepository.findAll();
    }

    /**
     * Retrieves a specific ingredient by its ID.
     *
     * @param id The ID of the desired ingredient.
     * @return The inventory item with the given ID, or {@code null} if not found.
     */
    @GetMapping("/{id}")
    public Inventory getIngredient(@PathVariable("id") int id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves the most popular ingredients used within a specified time period.
     *
     * Example usage:
     * {@code /api/inventory/top?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z}
     *
     * @param startDate The start date of the period (optional).
     * @param endDate   The end date of the period (optional).
     * @return A list of the most used ingredients within the given timeframe.
     */
    @GetMapping("/top")
    public List<InventoryItem> getTopIngredientsPeriodic(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        if (startDate == null && endDate == null)
            return inventoryRepository.findTopIngredientsPeriodic(DateUtil.startOfData(), DateUtil.endOfData());

        return inventoryRepository.findTopIngredientsPeriodic(startDate, endDate);
    }

    /**
     * Updates the details of an existing ingredient.
     *
     * @param inventory The inventory item with updated details, including a valid ID.
     * @return The updated inventory item, or {@code null} if the ID is not provided.
     */
    @PatchMapping("/update")
    public Inventory updateIngredient(@RequestBody Inventory inventory) {
        if (inventory.getId() == null)
            return null;

        return inventoryRepository.save(inventory);
    }

    /**
     * Updates the stock amount of a specific inventory item.
     *
     * @param id     The ID of the inventory item to update.
     * @param amount The amount to add to the current stock. Use a negative value to reduce stock.
     * @return The updated inventory item, or {@code null} if the item is not found.
     */
    @PatchMapping("/update/stock/{id}")
    public Inventory updateStock(@PathVariable("id") int id, @RequestParam("amount") int amount) {
        Inventory inventory = inventoryRepository.findById(id).orElse(null);

        if (inventory == null)
            return null;

        inventory.setAmount(inventory.getAmount() + amount);
        return inventoryRepository.save(inventory);
    }

    /**
     * Adds a new ingredient to the inventory.
     *
     * @param inventory The inventory item to add.
     * @return The newly added inventory item after saving to the database.
     */
    @PostMapping("/add")
    public Inventory addIngredient(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    /**
     * Deletes an inventory item by its ID.
     *
     * @param id The ID of the inventory item to delete.
     */
    @DeleteMapping("/delete")
    public void deleteIngredient(@RequestBody int id) {
        inventoryRepository.deleteById(id);
    }
}
