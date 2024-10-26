package com.pekings.pos.repository;

import com.pekings.pos.entities.MenuItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemEntityRepository extends JpaRepository<MenuItemEntity, Integer> {
}