package com.pekings.pos.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pekings.pos.Position;
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

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "username", length = Integer.MAX_VALUE)
    private String username;

    @Column(name = "pass", length = Integer.MAX_VALUE)
    private String pass;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "position", length = Integer.MAX_VALUE)
    private Position position;

    @Column(name = "last_clockin")
    private LocalTime lastClockin;

    @Column(name = "is_clockedin")
    private Boolean isClockedin;

    @Column(name = "pin")
    private String pin;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<Order> orders;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

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

}