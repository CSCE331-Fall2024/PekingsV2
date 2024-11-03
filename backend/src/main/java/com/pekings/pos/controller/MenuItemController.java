package com.pekings.pos.controller;

import com.pekings.pos.entities.MenuIngredient;
import com.pekings.pos.entities.MenuItem;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.repository.OrderRepository;
import com.pekings.pos.service.MenuIngredientService;
import com.pekings.pos.util.DateUtil;
import com.pekings.pos.util.SaleItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    private MenuIngredientService menuIngredientService;

    @Autowired
    private OrderItemRepository orderItemRepository;

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
        return menuIngredientService.getIngredientsByMenuItemId(id);
    }

    @GetMapping("/top")
    public List<SaleItem> getTopMenuItemsPeriodic(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        if (startDate == null && endDate == null)
            return orderItemRepository.getTopMenuItemPeriodic(DateUtil.startOfData(), DateUtil.endOfData());

        return orderItemRepository.getTopMenuItemPeriodic(startDate, endDate);
    }

}
