package com.pekings.pos.controller;

import com.pekings.pos.entities.Order;
import com.pekings.pos.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("/api/orders"))
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("{id}")
    public Order getOrder(@PathVariable("id") int id) {
        return orderRepository.findById(id).orElse(null);
    }

}
