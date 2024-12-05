package com.pekings.pos.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.OrderItemSerializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;

/**
 * Entity representing an item within a customer order.
 * Links a {@link MenuItem} to an {@link Order} and tracks associated extras or modifications.
 */
@Entity
@Table(name = "order_items")
@JsonSerialize(using = OrderItemSerializer.class)
public class OrderItem {

    /**
     * Unique identifier for the order item.
     * This is the primary key for the `order_items` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * The associated {@link Order} to which this item belongs.
     * Represents a many-to-one relationship with the `Order` entity.
     */
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Order order;

    /**
     * The associated {@link MenuItem} representing the selected menu item for the order.
     * Represents a many-to-one relationship with the `MenuItem` entity.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    /**
     * List of additional inventory items (extras) associated with this order item.
     * Represents a one-to-many relationship with the {@link OrderInventory} entity.
     */
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderInventory> extras;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public List<OrderInventory> getExtras() {
        return extras;
    }

    public void setExtras(List<OrderInventory> extras) {
        this.extras = extras;
    }
}
