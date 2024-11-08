package com.pekings.pos.controller;

import com.pekings.pos.entities.Order;
import com.pekings.pos.entities.OrderInventory;
import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(("/api/orders"))
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private InventoryController inventoryController;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable("id") int id) {
        return orderRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/menuitems")
    public List<OrderItem> getOrderItems(@PathVariable("id") int id) {
        return orderItemRepository.findByOrderId(id);
    }

    @GetMapping("/customer/{id}")
    public List<Order> getCustomerOrders(@PathVariable("id") int id) {
        return orderRepository.findByCustomerId(id);
    }

    @PatchMapping("/update")
    public Order updateOrder(@RequestBody Order order) {

        if (order.getId() == null)
            return null;

        return orderRepository.save(order);
    }

    /**
     * Adds an order. Sample request:
     * {
     *     "customer": { "id": 873 },
     *     "employee": { "id": 4 },
     *     "time": "2024-01-04T22:57:13Z",
     *     "price": 34.00,
     *     "items": [
     *         {
     *             "menuItem": { "id": 22 }
     *         },
     *         {
     *             "menuItem": { "id": 8 }
     *         }
     *     ],
     *     "extras": [
     *         {
     *             "ingredient": { "id": 10 },
     *             "amount": -1
     *         }
     *     ]
     * }
     *
     * @param order Order to be added
     * @return A copy of the order that was added to the DB
     *
 */
    @PostMapping("/add")
    public Order addOrder(@RequestBody Order order) {
        if (order.getItems() != null) {
            order.getItems().forEach(ingredient -> ingredient.setOrder(order));
        }

        for (OrderItem oi : order.getItems()) {
            menuItemRepository.findById(oi.getMenuItem().getId()).ifPresent(mi -> {
                mi.getIngredients().forEach(menuIngredient -> {
                    inventoryController.updateStock(menuIngredient.getId(), menuIngredient.getAmount() * -1);
                });
            });

        }

        for (OrderInventory oi : order.getExtras()) {
            inventoryController.updateStock(oi.getIngredient().getId(), oi.getAmount());
        }

        return orderRepository.save(order);
    }

    @DeleteMapping("/delete")
    public void deleteOrder(@RequestBody int id) {
        orderRepository.deleteById(id);
    }

}
