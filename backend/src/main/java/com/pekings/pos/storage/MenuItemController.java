package com.pekings.pos.storage;

import com.pekings.pos.entities.MenuItemEntity;
import com.pekings.pos.repository.MenuItemEntityRepository;
import com.pekings.pos.object.MenuItem;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/menuitem")
public class MenuItemController {

    private final MenuItemEntityRepository menuItemEntityRepository;

    public MenuItemController(MenuItemEntityRepository menuItemEntityRepository) {
        this.menuItemEntityRepository = menuItemEntityRepository;
    }

    @Override
    @PostMapping("/add-menu-item")
    public void addMenuItem(@RequestBody MenuItem menuItem) {
        MenuItemEntity menuItemEntity = new MenuItemEntity();

        menuItemEntity.setName(menuItem.getName());
        menuItemEntity.setPrice(BigDecimal.valueOf(menuItem.getPrice()));
        menuItemEntity.setActive(menuItem.isActive());

        menuItemEntityRepository.save(menuItemEntity);
    }

}
