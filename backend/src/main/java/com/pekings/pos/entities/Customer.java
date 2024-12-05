package com.pekings.pos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;

/**
 * Entity representing a customer in the system.
 * Each customer can be associated with multiple orders, capturing their purchasing activity.
 */
@Entity
@Table(name = "customers")
public class Customer {

    /**
     * Unique identifier for the customer.
     * This is the primary key for the `customers` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * List of orders placed by the customer.
     * Represents a one-to-many relationship with the {@link Order} entity.
     */
    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
