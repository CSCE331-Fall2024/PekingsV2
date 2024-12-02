package com.pekings.pos.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.OrderSerializer;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Entity representing a customer order in the system.
 * An order consists of multiple items, is associated with a customer, and is processed by an employee.
 */
@Entity
@Table(name = "orders")
@JsonSerialize(using = OrderSerializer.class)
public class Order {

    /**
     * Unique identifier for the order.
     * This is the primary key for the `orders` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * The customer who placed the order.
     * Represents a many-to-one relationship with the {@link Customer} entity.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /**
     * The total price of the order.
     */
    @Column(name = "price")
    private BigDecimal price;

    /**
     * The payment method used for the order (e.g., "credit_card", "cash").
     */
    @Column(name = "payment_method", length = Integer.MAX_VALUE)
    private String paymentMethod;

    /**
     * The employee who processed the order.
     * Represents a many-to-one relationship with the {@link Employee} entity.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    /**
     * The timestamp indicating when the order was placed.
     */
    @Column(name = "order_time")
    private Instant time;

    /**
     * The current status of the order (e.g., "pending", "completed").
     */
    @Column(nullable = false)
    private String status;

    /**
     * The list of items included in the order.
     * Represents a one-to-many relationship with the {@link OrderItem} entity.
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Instant getTime() {
        return time;
    }

    public void setTime(Instant time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
