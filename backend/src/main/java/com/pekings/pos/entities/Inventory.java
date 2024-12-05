package com.pekings.pos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/**
 * Entity representing an inventory item in the system.
 * Inventory items are ingredients or stock items used in menu items and tracked for usage and availability.
 */
@Entity
@Table(name = "inventory")
public class Inventory {

    /**
     * Unique identifier for the inventory item.
     * This is the primary key for the `inventory` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * Name of the inventory item (e.g., "Rice", "Sugar").
     */
    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    /**
     * The price per serving of the inventory item.
     */
    @Column(name = "serving_price")
    private BigDecimal servingPrice;

    /**
     * The current amount of the inventory item available in stock.
     */
    @Column(name = "amount")
    private Integer amount;

    /**
     * The price of the inventory item per batch purchase.
     */
    @Column(name = "price_batch")
    private BigDecimal priceBatch;

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

    public BigDecimal getServingPrice() {
        return servingPrice;
    }

    public void setServingPrice(BigDecimal servingPrice) {
        this.servingPrice = servingPrice;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public BigDecimal getPriceBatch() {
        return priceBatch;
    }

    public void setPriceBatch(BigDecimal priceBatch) {
        this.priceBatch = priceBatch;
    }
}
