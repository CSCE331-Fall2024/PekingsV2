package com.pekings.pos.util;

/**
 * Projection interface for representing inventory item usage data.
 * Typically used in queries to fetch a subset of fields rather than the entire entity.
 */
public interface InventoryItem {

    /**
     * Gets the ID of the inventory ingredient.
     *
     * @return The ID of the ingredient as an integer.
     */
    int getIngredientId();

    /**
     * Gets the total usage count of the inventory ingredient.
     *
     * @return The total number of times the ingredient has been used.
     */
    int getTotalUsage();
}
