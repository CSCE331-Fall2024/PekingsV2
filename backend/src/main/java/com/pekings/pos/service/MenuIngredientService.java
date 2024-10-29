package com.pekings.pos.service;

import com.pekings.pos.entities.MenuIngredient;
import com.pekings.pos.repository.MenuIngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuIngredientService {

    @Autowired
    private MenuIngredientRepository menuIngredientRepository;

    public List<MenuIngredient> getIngredientsByMenuItemId(int menuItemId) {
        return menuIngredientRepository.findByMenuItemId(menuItemId);
    }

}
