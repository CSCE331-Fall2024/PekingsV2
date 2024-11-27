package com.pekings.pos.controller;

import com.pekings.pos.entities.Order;
import com.pekings.pos.entities.OrderInventory;
import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.repository.MenuItemRepository;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.repository.OrderRepository;
import com.pekings.pos.util.DateUtil;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/past/{amount}")
    public List<Order> getPreviousOrder(@PathVariable("amount") int amount) {
        return orderRepository.findByTimeRange(DateUtil.startOfData(), Instant.now(), Pageable.ofSize(amount));
    }

    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable("status") String status) {
        return orderRepository.findByStatus(status);
    }

    @GetMapping("/{id}/menuitems")
    public List<OrderItem> getOrderItems(@PathVariable("id") int id) {
        return orderItemRepository.findByOrderId(id);
    }

    @GetMapping("/customer/{id}")
    public List<Order> getCustomerOrders(@PathVariable("id") int id) {
        return orderRepository.findByCustomerId(id);
    }

    @PatchMapping("/update/status/{id}")
    public Order updateOrderStatus(@PathVariable("id") int id, @RequestParam(value = "status") String newStatus) {
        Order order = getOrder(id);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Adds an order. Sample request:
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
     *
     * @param order Order to be added
     * @return A copy of the order that was added to the DB
     *
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

    @DeleteMapping("/delete")
    public void deleteOrder(@RequestBody int id) {
        orderRepository.deleteById(id);
    }

}
