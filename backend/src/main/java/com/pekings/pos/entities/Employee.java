package com.pekings.pos.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pekings.pos.util.Position;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalTime;
import java.util.List;

/**
 * Entity representing an employee in the system.
 * Employees are responsible for managing various tasks, including processing orders and handling inventory.
 */
@Entity
@Table(name = "employees")
public class Employee {

    /**
     * Unique identifier for the employee.
     * This is the primary key for the `employees` table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /**
     * Username for the employee, used for identification or login purposes.
     */
    @Column(name = "username", length = Integer.MAX_VALUE)
    private String username;

    /**
     * Encrypted password for the employee, used for authentication.
     */
    @Column(name = "pass", length = Integer.MAX_VALUE)
    private String pass;

    /**
     * Email address of the employee, used for communication and identification.
     */
    @Column(name = "email")
    private String email;

    /**
     * Role or position of the employee within the system (e.g., MANAGER, CASHIER, KITCHEN).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "position", length = Integer.MAX_VALUE)
    private Position position;

    /**
     * The last recorded clock-in time for the employee.
     */
    @Column(name = "last_clockin")
    private LocalTime lastClockin;

    /**
     * Flag indicating whether the employee is currently clocked in.
     */
    @Column(name = "is_clockedin")
    private Boolean isClockedin;

    /**
     * A unique PIN used for quick authentication in the system.
     */
    @Column(name = "pin")
    private String pin;

    /**
     * List of orders processed by the employee.
     * Represents a one-to-many relationship with the {@link Order} entity.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Order> orders;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public LocalTime getLastClockin() {
        return lastClockin;
    }

    public void setLastClockin(LocalTime lastClockin) {
        this.lastClockin = lastClockin;
    }

    public Boolean getIsClockedin() {
        return isClockedin;
    }

    public void setIsClockedin(Boolean isClockedin) {
        this.isClockedin = isClockedin;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
