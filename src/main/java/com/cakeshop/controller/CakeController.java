package com.cakeshop.controller;

import com.cakeshop.model.Cake;
import com.cakeshop.repository.CakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {

    @Autowired
    private CakeRepository cakeRepository;

    @GetMapping
    public ResponseEntity<List<Cake>> getAllCakes() {
        return ResponseEntity.ok(cakeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cake> getCakeById(@PathVariable Long id) {
        return cakeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Cake>> getCakesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(cakeRepository.findByCategory(category));
    }
}
