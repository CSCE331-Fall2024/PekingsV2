package com.pekings.pos.controller;

import com.pekings.pos.entities.Employee;
import com.pekings.pos.entities.MenuItem;
import com.pekings.pos.repository.EmployeeRepository;
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
@RequestMapping(("/api/employee"))
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getAllEmployees(@PathVariable("id") int id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @PatchMapping("/update")
    public Employee updateEmployee(@RequestBody Employee employee) {

        if (employee.getId() == null)
            return null;

        return employeeRepository.save(employee);
    }

    @PostMapping("/add")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/delete")
    public void deleteEmployee(@RequestBody int id) {
        employeeRepository.deleteById(id);
    }

}
