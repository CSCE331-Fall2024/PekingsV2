package com.pekings.pos.controller;

import com.pekings.pos.entities.Order;
import com.pekings.pos.entities.OrderInventory;
import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.repository.OrderRepository;
import com.pekings.pos.util.DateUtil;
import com.pekings.pos.util.SaleHistoryItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * REST Controller for managing Order-related operations.
 * Provides endpoints for CRUD operations and querying orders based on various criteria.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private InventoryController inventoryController;

    @Autowired
    private MenuItemRepository menuItemRepository;

    /**
     * Retrieves an order by its ID.
     *
     * @param id The ID of the order to retrieve.
     * @return The order with the given ID, or {@code null} if not found.
     */
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable("id") int id) {
        return orderRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves a specified number of recent orders.
     *
     * @param amount The number of recent orders to retrieve.
     * @return A list of recent orders within the specified limit.
     */
    @GetMapping("/past/{amount}")
    public List<Order> getPreviousOrder(@PathVariable("amount") int amount) {
        return orderRepository.findByTimeRange(DateUtil.startOfData(), Instant.now(), Pageable.ofSize(amount));
    }

    /**
     * Retrieves the daily revenue and order statistics.
     *
     * @return A list of revenue and order statistics for the current day.
     */
    @GetMapping("/past/day")
    public List<SaleHistoryItem> getDailyRevenue() {
        return orderRepository.getRevenueAndOrdersPeriodic(DateUtil.startOfDay(Instant.now()), DateUtil.endOfDay(Instant.now()));
    }

    /**
     * Retrieves orders filtered by their status.
     *
     * @param status The status to filter orders by.
     * @return A list of orders with the specified status.
     */
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable("status") String status) {
        return orderRepository.findByStatus(status);
    }

    /**
     * Retrieves all menu items in an order by the order's ID.
     *
     * @param id The ID of the order.
     * @return A list of order items associated with the order.
     */
    @GetMapping("/{id}/menuitems")
    public List<OrderItem> getOrderItems(@PathVariable("id") int id) {
        return orderItemRepository.findByOrderId(id);
    }

    /**
     * Retrieves all orders made by a specific customer.
     *
     * @param id The ID of the customer.
     * @return A list of orders associated with the customer.
     */
    @GetMapping("/customer/{id}")
    public List<Order> getCustomerOrders(@PathVariable("id") int id) {
        return orderRepository.findByCustomerId(id);
    }

    /**
     * Updates the status of an existing order.
     *
     * @param id       The ID of the order to update.
     * @param newStatus The new status to set for the order.
     * @return The updated order with the new status.
     */
    @PatchMapping("/update/status/{id}")
    public Order updateOrderStatus(@PathVariable("id") int id, @RequestParam(value = "status") String newStatus) {
        Order order = getOrder(id);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Adds a new order to the system.
     *
     * Sample request:
     * <pre>
     * {
     *     "customer": { "id": 503 },
     *     "employee": { "id": 3 },
     *     "time": "2024-11-13T02:47:03.484Z",
     *     "price": 10.63,
     *     "payment_method": "credit_card",
     *     "items": [
     *         {
     *             "menuItem": { "id": 6 },
     *             "extras": [
     *                 {
     *                     "ingredient": {
     *                         "id": 5
     *                     },
     *                     "amount": -1
     *                 }
     *             ]
     *         }
     *     ]
     * }
     * </pre>
     *
     * @param order The order to add.
     * @return The newly added order after saving to the database.
     */
    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        if (order.getItems() != null) {
            order.getItems().forEach(item -> {
                item.setOrder(order);
                item.getExtras().forEach(extra -> extra.setOrderItem(item));
            });
        }

        for (OrderItem oi : order.getItems()) {
            menuItemRepository.findById(oi.getMenuItem().getId()).ifPresent(mi -> {
                mi.getIngredients().forEach(menuIngredient -> {
                    OrderInventory extra = oi.getExtras().stream().filter(orderInventory -> Objects.equals(orderInventory.getId(),
                            menuIngredient.getId())).findAny().orElse(null);

                    int extraAmount = extra == null ? 0 : extra.getAmount();
                    inventoryController.updateStock(menuIngredient.getId(), extraAmount + menuIngredient.getAmount());
                });
            });

        }

        return orderRepository.save(order);
    }

    /**
     * Deletes an order by its ID.
     *
     * @param id The ID of the order to delete.
     */
    @DeleteMapping("/delete")
    public void deleteOrder(@RequestBody int id) {
        orderRepository.deleteById(id);
    }

}

