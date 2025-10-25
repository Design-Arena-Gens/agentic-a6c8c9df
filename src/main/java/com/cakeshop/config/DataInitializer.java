package com.cakeshop.config;

import com.cakeshop.model.Cake;
import com.cakeshop.repository.CakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CakeRepository cakeRepository;

    @Override
    public void run(String... args) {
        if (cakeRepository.count() == 0) {
            cakeRepository.saveAll(Arrays.asList(
                new Cake(null, "Chocolate Fudge Cake", "Rich chocolate cake with creamy fudge frosting",
                    new BigDecimal("45.99"), "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
                    "Chocolate", 20, true),
                new Cake(null, "Vanilla Dream Cake", "Light and fluffy vanilla cake with buttercream",
                    new BigDecimal("39.99"), "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
                    "Vanilla", 15, true),
                new Cake(null, "Red Velvet Delight", "Classic red velvet with cream cheese frosting",
                    new BigDecimal("42.99"), "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400",
                    "Specialty", 18, true),
                new Cake(null, "Strawberry Shortcake", "Fresh strawberries with whipped cream",
                    new BigDecimal("48.99"), "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
                    "Fruit", 12, true),
                new Cake(null, "Lemon Zest Cake", "Tangy lemon cake with citrus glaze",
                    new BigDecimal("41.99"), "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400",
                    "Fruit", 16, true),
                new Cake(null, "Black Forest Cake", "Chocolate cake with cherries and whipped cream",
                    new BigDecimal("49.99"), "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400",
                    "Chocolate", 10, true),
                new Cake(null, "Carrot Cake", "Moist carrot cake with cream cheese frosting",
                    new BigDecimal("43.99"), "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400",
                    "Specialty", 14, true),
                new Cake(null, "Tiramisu Cake", "Italian coffee-flavored dessert cake",
                    new BigDecimal("52.99"), "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
                    "Specialty", 8, true)
            ));
        }
    }
}
