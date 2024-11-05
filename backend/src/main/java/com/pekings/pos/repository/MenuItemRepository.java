package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    List<MenuItem> findByCategory(String category);

}