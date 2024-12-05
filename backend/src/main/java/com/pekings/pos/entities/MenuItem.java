package com.pekings.pos.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.List;

/**
 * Entity representing a menu item in the system.
 * A menu item can have multiple ingredients and is available for customer orders.
 */
@Entity
@Table(name = "menu")
public class MenuItem {

    /**
     * Unique identifier for the menu item.
     * This is the primary key for the `menu` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * The name of the menu item (e.g., "Rice Mountain", "Chicken Spice Noodles").
     */
    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    /**
     * The price of the menu item.
     */
    @Column(name = "price")
    private BigDecimal price;

    /**
     * Indicates whether the menu item is currently active (available for orders).
     */
    @Column(name = "active")
    private Boolean active;

    /**
     * The category of the menu item (e.g., "Drink", "Seasonal", "Dessert").
     */
    @Column(name = "category")
    private String category;

    /**
     * An image URL or reference representing the menu item.
     */
    @Column(name = "image")
    private String image;

    /**
     * List of ingredients used in the menu item.
     * Represents a one-to-many relationship with the {@link MenuIngredient} entity.
     */
    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL)
    private List<MenuIngredient> ingredients;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<MenuIngredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<MenuIngredient> ingredients) {
        this.ingredients = ingredients;
    }
}
