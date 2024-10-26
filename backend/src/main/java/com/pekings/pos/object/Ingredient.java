package com.pekings.pos.object;

import java.util.Objects;

public class Ingredient {

    private final long id;
    private String name;
    private float price;
    private int amount;
    private float batchPrice;
    public Ingredient(long id, String name, float price, int amount, float batchPrice) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.batchPrice = batchPrice;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public float getPrice() {
        return price;
    }

    public int getAmount() {
        return amount;
    }

    public float getBatchPrice() {
        return batchPrice;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void setBatchPrice(float batchPrice) {
        this.batchPrice = batchPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ingredient other)) return false;

        return getId() == other.getId();
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
