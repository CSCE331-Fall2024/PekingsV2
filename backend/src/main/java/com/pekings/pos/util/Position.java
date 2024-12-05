package com.pekings.pos.util;

/**
 * Enum representing the possible positions of employees within the system.
 * Each position corresponds to a specific role with distinct permissions and responsibilities.
 */
public enum Position {

    /**
     * Represents a Manager.
     * - Typically has the highest level of access, including managing employees, inventory, menu items, and orders.
     */
    MANAGER,

    /**
     * Represents a Cashier.
     * - Responsible for handling customer transactions and managing orders.
     */
    CASHIER,

    /**
     * Represents a Kitchen Staff member.
     * - Handles the preparation of orders and updates their status.
     */
    KITCHEN
}
