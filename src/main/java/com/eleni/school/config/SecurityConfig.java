package com.eleni.school.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuration: SecurityConfig
 * Σκοπός: Κεντρική ρύθμιση της ασφάλειας της εφαρμογής.
 * Εδώ ορίζονται οι κανόνες πρόσβασης (Authorization), η διαχείριση του CORS,
 * η απενεργοποίηση του CSRF για την ευκολία των API calls και οι ρυθμίσεις του Login/Logout.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                /* 1. Ρύθμιση CORS (Cross-Origin Resource Sharing):
                 * Επιτρέπει στο Frontend (localhost:3000) να επικοινωνεί με το Backend (localhost:8080).
                 * Χωρίς αυτές τις ρυθμίσεις, ο browser θα μπλόκαρε τα αιτήματα για λόγους ασφαλείας.
                 */
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:3000")); // Επιτρεπόμενη πηγή
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));

                    /* ΚΡΙΣΙΜΟ: setAllowCredentials(true)
                     * Επιτρέπει την αποστολή των Session Cookies από το React.
                     * Χωρίς αυτό, ο χρήστης θα "ξεχνούσε" ότι συνδέθηκε σε κάθε refresh.
                     */
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))

                /* 2. Απενεργοποίηση CSRF:
                 * Στις εφαρμογές API που χρησιμοποιούν stateless authentication ή ελεγχόμενο CORS,
                 * συχνά το απενεργοποιούμε για να διευκολύνουμε τα POST/PUT αιτήματα από το Frontend.
                 */
                .csrf(csrf -> csrf.disable())

                /* 3. Κανόνες Πρόσβασης (Authorization):
                 * Ορίζουμε ποια endpoints είναι δημόσια και ποια απαιτούν σύνδεση.
                 */
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll() // Δημόσιο για να μπορεί κάποιος να συνδεθεί
                        .requestMatchers("/api/auth/me").permitAll()    // Δημόσιο για να ελέγχει το App.js την κατάσταση σύνδεσης
                        .anyRequest().authenticated()                   // Όλα τα υπόλοιπα (μαθητές, βαθμοί κλπ) απαιτούν login
                )

                /* 4. Ρύθμιση Form Login:
                 * Προσαρμόζουμε το κλασικό Login του Spring Security ώστε να δουλεύει ως REST API.
                 */
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
                        .successHandler((request, response, authentication) -> {
                            /* Αντί για ανακατεύθυνση (redirect), επιστρέφουμε status 200 OK
                             * ώστε το React (axios) να ξέρει ότι η σύνδεση πέτυχε.
                             */
                            response.setStatus(200);
                        })
                        .failureHandler((request, response, exception) -> {
                            // Επιστρέφουμε 401 Unauthorized σε περίπτωση αποτυχίας
                            response.setStatus(401);
                        })
                )

                /* 5. Ρύθμιση Logout:
                 * Ορίζουμε το μονοπάτι αποσύνδεσης και διασφαλίζουμε ότι είναι προσβάσιμο.
                 */
                .logout(logout -> logout.logoutUrl("/api/auth/logout").permitAll());

        return http.build();
    }
}