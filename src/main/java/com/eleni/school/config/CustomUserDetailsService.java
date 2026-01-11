package com.eleni.school.config;

import com.eleni.school.model.Teacher;
import com.eleni.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

/**
 * Service: CustomUserDetailsService
 * Σκοπός: Υλοποίηση του interface UserDetailsService του Spring Security.
 * Αυτή η κλάση αναλαμβάνει τη διαδικασία ταυτοποίησης (Authentication) των χρηστών
 * κατά τη στιγμή του Login.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TeacherRepository teacherRepository;

    /**
     * Η μέθοδος loadUserByUsername καλείται αυτόματα από το Spring Security.
     * Ελέγχει αν το email που έδωσε ο χρήστης αντιστοιχεί σε έγκυρο λογαριασμό.
     * * @param email Το email που εισήγαγε ο χρήστης στη φόρμα Login.
     * @return UserDetails Ένα αντικείμενο που περιέχει το username, το password και τα roles.
     * @throws UsernameNotFoundException Αν δεν βρεθεί ο χρήστης.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        /* * 1. Ειδική Περίπτωση: Στατικός έλεγχος για τον Διευθυντή (Admin).
         * Εδώ ορίζουμε έναν "hardcoded" λογαριασμό διαχειριστή για το σύστημα.
         * Ο ρόλος ADMIN δίνει πρόσβαση σε όλες τις διαγραφές και προσθήκες.
         */
        if ("director@school.gr".equals(email)) {
            return User.withUsername("director@school.gr")
                    .password("{noop}admin123") // {noop} = No Operation: Ο κωδικός αποθηκεύεται σε απλό κείμενο (Plain Text)
                    .roles("ADMIN")
                    .build();
        }

        /* * 2. Δυναμικός έλεγχος: Αναζήτηση στη βάση δεδομένων (MySQL).
         * Χρησιμοποιούμε το TeacherRepository για να βρούμε αν το email ανήκει σε κάποιον εκπαιδευτικό.
         */
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Ο εκπαιδευτικός δεν βρέθηκε: " + email));

        /* * 3. Επιστροφή του Εκπαιδευτικού.
         * Ορίζουμε τον ρόλο "TEACHER", ο οποίος επιτρέπει την πρόσβαση μόνο στο δικό του τμήμα.
         * Σημείωση: Για λόγους ευκολίας στην ανάπτυξη (development), χρησιμοποιούμε σταθερό κωδικό "password".
         */
        return User.withUsername(teacher.getEmail())
                .password("{noop}password")
                .roles("TEACHER")
                .build();
    }
}