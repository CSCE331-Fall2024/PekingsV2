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
import org.springframework.security.access.prepost.PreAuthorize;
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

@RestController
@RequestMapping("/api/menuitem")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private MenuIngredientRepository menuIngredientRepository;

    @GetMapping("/all")
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll().stream().sorted(Comparator.comparingInt(MenuItem::getId)).toList();
    }

    @GetMapping("/{id}")
    public MenuItem getMenuItem(@PathVariable("id") int id) {
        return menuItemRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/ingredients")
    public List<MenuIngredient> getIngredients(@PathVariable("id") int id) {
        return menuIngredientRepository.findByMenuItemId(id);
    }

    @GetMapping("/top")
    public List<SaleItem> getTopMenuItemsPeriodic(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        if (startDate == null && endDate == null)
            return orderItemRepository.getTopMenuItemPeriodic(DateUtil.startOfData(), DateUtil.endOfData());

        return orderItemRepository.getTopMenuItemPeriodic(startDate, endDate);
    }

    @GetMapping("/category/{category}")
    public List<MenuItem> getMenuItemsCategory(@PathVariable("category") String category) {
        return menuItemRepository.findByCategory(category);
    }

    @PostMapping("/add")
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        if (menuItem.getIngredients() != null) {
            menuItem.getIngredients().forEach(ingredient -> ingredient.setMenuItem(menuItem));
        }

        return menuItemRepository.save(menuItem);
    }

    /**
     * updates a menuItem. Sample body:
     * **You must specify the menu item id when using this method**
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
     *
     * @param menuItem The menu item to update
     * @return The menu item with updated contents
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

    @DeleteMapping("/delete")
    public void deleteMenuItem(@RequestBody int menuItemID) {
        menuItemRepository.deleteById(menuItemID);
    }

}
