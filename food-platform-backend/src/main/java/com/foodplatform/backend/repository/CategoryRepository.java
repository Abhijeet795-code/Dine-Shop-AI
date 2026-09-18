package com.foodplatform.backend.repository;

import com.foodplatform.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByShop_ShopIdOrderByDisplayOrderAsc(UUID shopId);
    List<Category> findAllByShop_ShopIdAndCategoryNameIgnoreCase(UUID shopId, String categoryName);
}