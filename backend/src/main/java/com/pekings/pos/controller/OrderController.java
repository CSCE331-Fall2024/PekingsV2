package com.pekings.pos.controller;

import com.pekings.pos.entities.Order;
import com.pekings.pos.entities.OrderItem;
import com.pekings.pos.repository.OrderItemRepository;
import com.pekings.pos.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

}
