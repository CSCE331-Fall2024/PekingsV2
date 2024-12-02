package com.pekings.pos.controller;

import com.pekings.pos.entities.Employee;
import com.pekings.pos.entities.Order;
import com.pekings.pos.repository.EmployeeRepository;
import com.pekings.pos.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for managing Employee-related operations.
 * Provides endpoints for CRUD operations on employees and retrieving employee-specific data.
 */
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Retrieves all employees.
     *
     * @return A list of all employees in the system.
     */
    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Retrieves an employee by their ID.
     *
     * @param id The ID of the desired employee.
     * @return The employee matching the provided ID, or {@code null} if not found.
     */
    @GetMapping("/{id}")
    public Employee getAllEmployees(@PathVariable("id") int id) {
        return employeeRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves an employee by their email address.
     *
     * @param email The email address of the desired employee.
     * @return The first employee with a matching email address, or {@code null} if not found.
     */
    @GetMapping
    public Employee getEmployeeByEmail(@RequestParam("email") String email) {
        return employeeRepository.findByEmail(email);
    }

    /**
     * Retrieves all orders placed by a specific employee.
     *
     * @param id The ID of the employee whose orders are to be retrieved.
     * @return A list of orders associated with the given employee ID.
     */
    @GetMapping("/{id}/orders")
    public List<Order> getEmployeeOrders(@PathVariable("id") int id) {
        return orderRepository.findByEmployeeId(id);
    }

    /**
     * Updates an existing employee's details.
     *
     * @param employee The updated employee object, which must include a valid ID.
     * @return The updated employee object if successful, or {@code null} if the ID is not provided.
     */
    @PatchMapping("/update")
    public Employee updateEmployee(@RequestBody Employee employee) {
        if (employee.getId() == null)
            return null;

        return employeeRepository.save(employee);
    }

    /**
     * Adds a new employee to the system.
     *
     * @param employee The employee object to be added.
     * @return The added employee object after it is saved to the database.
     */
    @PostMapping("/add")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    /**
     * Deletes an employee from the system.
     *
     * @param id The ID of the employee to be deleted.
     */
    @DeleteMapping("/delete")
    public void deleteEmployee(@RequestBody int id) {
        employeeRepository.deleteById(id);
    }

}
