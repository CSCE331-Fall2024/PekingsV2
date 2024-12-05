package com.pekings.pos.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.MenuIngredientSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entity representing an ingredient used in a menu item.
 * Links an {@link Inventory} item to a {@link MenuItem} and specifies the amount required.
 */
@Entity
@Table(name = "menu_ingredients")
@JsonSerialize(using = MenuIngredientSerializer.class)
public class MenuIngredient {

    /**
     * Unique identifier for the menu ingredient association.
     * This is the primary key for the `menu_ingredients` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * The associated {@link Inventory} item (ingredient).
     * Represents a many-to-one relationship with the `Inventory` entity.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Inventory ingredient;

    /**
     * The associated {@link MenuItem} that uses the ingredient.
     * Represents a many-to-one relationship with the `MenuItem` entity.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item")
    private MenuItem menuItem;

    /**
     * The amount of the ingredient used in the menu item.
     */
    @Column(name = "ingredients_in_item")
    private Integer amount;

    // Getters and setters

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

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}
