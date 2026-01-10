package com.eleni.school.config;

import com.eleni.school.model.Teacher;
import com.eleni.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Έλεγχος αν είναι ο Διευθυντής (Admin)
        if ("director@school.gr".equals(email)) {
            return User.withUsername("director@school.gr")
                    .password("{noop}admin123") // Το {noop} επιτρέπει απλό κείμενο χωρίς κρυπτογράφηση
                    .roles("ADMIN")
                    .build();
        }

        // 2. Αναζήτηση στον πίνακα των Teachers
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Ο εκπαιδευτικός δεν βρέθηκε: " + email));

        // 3. Επιστρέφουμε τον δάσκαλο
        // Χρησιμοποιούμε το {noop} ώστε ο κωδικός να είναι σκέτο "password"
        return User.withUsername(teacher.getEmail())
                .password("{noop}password")
                .roles("TEACHER")
                .build();
    }
}