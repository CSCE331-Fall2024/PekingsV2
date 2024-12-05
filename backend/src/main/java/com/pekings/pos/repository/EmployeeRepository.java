package com.pekings.pos.repository;

import com.pekings.pos.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for performing CRUD operations on {@link Employee} entities.
 * Extends {@link JpaRepository} to inherit standard database interaction methods.
 */
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    /**
     * Finds an employee by their email address.
     *
     * @param email The email address of the employee to find.
     * @return The {@link Employee} entity matching the provided email, or {@code null} if no match is found.
     */
    Employee findByEmail(String email);
}
