package com.pekings.pos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "serving_price")
    private BigDecimal servingPrice;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "price_batch")
    private BigDecimal priceBatch;

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