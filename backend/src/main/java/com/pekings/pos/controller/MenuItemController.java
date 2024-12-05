package com.pekings.pos.controller;

import com.pekings.pos.entities.MenuIngredient;
import com.pekings.pos.entities.MenuItem;
import com.pekings.pos.repository.MenuIngredientRepository;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.util.DateUtil;
import com.pekings.pos.util.SaleItem;
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
import java.util.Comparator;
import java.util.List;

/**
 * REST Controller for managing Menu Item-related operations.
 * Provides endpoints for CRUD operations, retrieving menu item details, and analytics on menu items.
 */
@RestController
@RequestMapping("/api/menuitem")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private MenuIngredientRepository menuIngredientRepository;

    /**
     * Retrieves all menu items, sorted by their ID.
     *
     * @return A list of all menu items, sorted by ID.
     */
    @GetMapping("/all")
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll().stream().sorted(Comparator.comparingInt(MenuItem::getId)).toList();
    }

    /**
     * Retrieves a specific menu item by its ID.
     *
     * @param id The ID of the desired menu item.
     * @return The menu item with the given ID, or {@code null} if not found.
     */
    @GetMapping("/{id}")
    public MenuItem getMenuItem(@PathVariable("id") int id) {
        return menuItemRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves the ingredients associated with a specific menu item.
     *
     * @param id The ID of the menu item.
     * @return A list of ingredients associated with the menu item.
     */
    @GetMapping("/{id}/ingredients")
    public List<MenuIngredient> getIngredients(@PathVariable("id") int id) {
        return menuIngredientRepository.findByMenuItemId(id);
    }

    /**
     * Retrieves the top-selling menu items within a specified time period.
     *
     * Example usage:
     * {@code /api/menuitem/top?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z}
     *
     * @param startDate The start date of the period (optional).
     * @param endDate   The end date of the period (optional).
     * @return A list of top-selling menu items within the given timeframe.
     */
    @GetMapping("/top")
    public List<SaleItem> getTopMenuItemsPeriodic(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        if (startDate == null && endDate == null)
            return orderItemRepository.getTopMenuItemPeriodic(DateUtil.startOfData(), DateUtil.endOfData());

        return orderItemRepository.getTopMenuItemPeriodic(startDate, endDate);
    }

    /**
     * Retrieves menu items belonging to a specific category.
     *
     * @param category The category of menu items to retrieve.
     * @return A list of menu items in the specified category.
     */
    @GetMapping("/category/{category}")
    public List<MenuItem> getMenuItemsCategory(@PathVariable("category") String category) {
        return menuItemRepository.findByCategory(category);
    }

    /**
     * Adds a new menu item to the system.
     *
     * @param menuItem The menu item to add, including optional associated ingredients.
     * @return The added menu item after saving to the database.
     */
    @PostMapping("/add")
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        if (menuItem.getIngredients() != null) {
            menuItem.getIngredients().forEach(ingredient -> ingredient.setMenuItem(menuItem));
        }

        return menuItemRepository.save(menuItem);
    }

    /**
     * Updates an existing menu item.
     *
     * Example request body:
     * <pre>
     * {
     *     "id": 46,
     *     "name": "Sushi Platter",
     *     "price": 20.00,
     *     "active": true,
     *     "category": "seasonal",
     *     "ingredients": [
     *         {
     *             "ingredient": { "id": 5 },
     *             "amount": 3
     *         },
     *         {
     *             "ingredient": { "id": 6 },
     *             "amount": 3
     *         }
     *     ]
     * }
     * </pre>
     *
     * @param menuItem The updated menu item, which must include a valid ID.
     * @return The updated menu item after saving to the database, or {@code null} if the ID is not provided.
     */
    @PatchMapping("/update")
    public MenuItem updateMenuItem(@RequestBody MenuItem menuItem) {
        if (menuItem.getId() == null)
            return null;

        if (menuItem.getIngredients() != null) {
            menuItem.getIngredients().forEach(ingredient -> ingredient.setMenuItem(menuItem));
        }

        return menuItemRepository.save(menuItem);
    }

    /**
     * Deletes a menu item by its ID.
     *
     * @param menuItemID The ID of the menu item to delete.
     */
    @DeleteMapping("/delete")
    public void deleteMenuItem(@RequestBody int menuItemID) {
        menuItemRepository.deleteById(menuItemID);
    }
}
