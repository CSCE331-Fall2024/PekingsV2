package com.pekings.pos.object;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Customer {

    private final long id;
    private final List<Order> orders;

    public Customer(long id) {
        this.id = id;
        this.orders = new ArrayList<>();
    }

    public long getId() {
        return id;
    }

    public void addOrder(Order order) {
        orders.add(order);
    }

    public List<Order> getOrders() {
        return new ArrayList<>(orders);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee other)) return false;

        return getId() == other.getId();
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
