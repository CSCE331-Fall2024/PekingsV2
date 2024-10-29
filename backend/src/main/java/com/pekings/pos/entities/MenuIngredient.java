package com.pekings.pos.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.MenuIngredientSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu_ingredients")
@JsonSerialize(using = MenuIngredientSerializer.class)
public class MenuIngredient {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Inventory ingredient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item")
    private MenuItem menuItem;

    @Column(name = "ingredients_in_item")
    private Integer ingredientsInItem;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Inventory getIngredient() {
        return ingredient;
    }

    public void setIngredient(Inventory ingredient) {
        this.ingredient = ingredient;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public Integer getIngredientsInItem() {
        return ingredientsInItem;
    }

    public void setIngredientsInItem(Integer ingredientsInItem) {
        this.ingredientsInItem = ingredientsInItem;
    }

}