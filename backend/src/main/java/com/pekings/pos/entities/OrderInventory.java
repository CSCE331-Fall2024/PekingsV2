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

import java.util.List;

@Entity
@Table(name = "order_inventory")
@JsonSerialize(using = OrderInventorySerializer.class)
public class OrderInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id")
    private Inventory ingredient;

    @Column(name = "amount")
    private int amount;

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

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

}