package com.eleni.school.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration: WebConfig
 * Σκοπός: Παραμετροποίηση των ρυθμίσεων του Spring MVC.
 * Υλοποιεί το interface WebMvcConfigurer για να ορίσει παγκόσμιους κανόνες
 * σχετικά με το πώς ο server απαντά σε αιτήματα από διαφορετικές προελεύσεις (CORS).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Η μέθοδος addCorsMappings ορίζει τους κανόνες CORS για όλη την εφαρμογή.
     * Αυτό είναι απαραίτητο όταν το Frontend (React) και το Backend (Spring Boot)
     * τρέχουν σε διαφορετικά ports (π.χ. 3000 και 8080).
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Εφαρμογή των κανόνων σε όλα τα μονοπάτια που ξεκινούν με /api/
                .allowedOrigins("http://localhost:3000") // Ρητή επιτροπή πρόσβασης μόνο στην εφαρμογή React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Επιτρεπόμενες HTTP μέθοδοι για CRUD λειτουργίες
                .allowedHeaders("*"); // Επιτροπή όλων των HTTP Headers (π.χ. Content-Type, Authorization)
    }
}