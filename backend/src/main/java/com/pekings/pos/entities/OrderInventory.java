package com.pekings.pos.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.OrderInventorySerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Entity representing the inventory items used as extras or modifications for an order item.
 * Links an {@link Inventory} item to an {@link OrderItem} and tracks the amount used.
 */
@Entity
@Table(name = "order_inventory")
@JsonSerialize(using = OrderInventorySerializer.class)
public class OrderInventory {

    /**
     * Unique identifier for the order inventory record.
     * This is the primary key for the `order_inventory` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * The associated {@link OrderItem} for which the inventory item is used.
     * Represents a many-to-one relationship with the `OrderItem` entity.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    /**
     * The associated {@link Inventory} item used in the order.
     * Represents a one-to-one relationship with the `Inventory` entity.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id")
    private Inventory ingredient;

    /**
     * The quantity of the inventory item used in the order item.
     */
    @Column(name = "amount")
    private int amount;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public Inventory getIngredient() {
        return ingredient;
    }

    public void setIngredient(Inventory ingredient) {
        this.ingredient = ingredient;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
