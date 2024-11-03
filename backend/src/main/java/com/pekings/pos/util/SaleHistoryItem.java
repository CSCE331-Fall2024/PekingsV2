package com.pekings.pos.util;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.pekings.pos.serialization.SaleHistItemSerializer;

@JsonSerialize(using = SaleHistItemSerializer.class)
public class SaleHistoryItem {

    private final int menuItemID;
    private final String name;
    private final int totalOrders;
    private final double totalRevenue;

    public SaleHistoryItem(int menuItemID, String name, int totalOrders, double totalRevenue) {
        this.name = name;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.menuItemID = menuItemID;
    }

    public int getMenuItemID() {
        return menuItemID;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public String getName() {
        return name;
    }
}
