package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    List<MenuItem> findByCategory(String category);

}