package com.pekings.pos.repository;

import com.pekings.pos.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Employee findByEmail(String email);

}