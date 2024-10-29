package com.pekings.pos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalTime;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "username", length = Integer.MAX_VALUE)
    private String username;

    @Column(name = "pass", length = Integer.MAX_VALUE)
    private String pass;

    @Column(name = "\"position\"", length = Integer.MAX_VALUE)
    private String position;

    @Column(name = "last_clockin")
    private LocalTime lastClockin;

    @Column(name = "is_clockedin")
    private Boolean isClockedin;

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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
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