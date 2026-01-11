package com.eleni.school.controller;

import com.eleni.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller: AuthController
 * Σκοπός: Διαχείριση των πληροφοριών ταυτοποίησης του χρήστη.
 * Παρέχει το κρίσιμο endpoint /api/auth/me, το οποίο καλείται από τη React
 * μετά από κάθε login ή refresh της σελίδας για να ανακτηθεί το προφίλ του χρήστη.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TeacherRepository teacherRepository;

    /**
     * Επιστρέφει τις λεπτομέρειες του συνδεδεμένου λογαριασμού.
     * Αντλεί δεδομένα από το Security Context και, αν πρόκειται για εκπαιδευτικό,
     * συμπληρώνει επιπλέον στοιχεία από τη βάση δεδομένων (όπως το τμήμα του).
     * * @return Μια δομή Map με το username, το role και τα προσωπικά στοιχεία του χρήστη.
     */
    @GetMapping("/me")
    public Map<String, Object> getAccountDetails() {
        // Ανάκτηση του αντικειμένου Authentication από το Security Context του Spring
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = new HashMap<>();

        // Αν δεν υπάρχει ταυτοποιημένος χρήστης, το auth.getName() θα επιστρέψει "anonymousUser"
        String username = auth.getName();
        String role = auth.getAuthorities().toString();

        details.put("username", username);
        // Απλοποίηση του ρόλου για το Frontend (ADMIN ή TEACHER)
        details.put("role", role.contains("ADMIN") ? "ADMIN" : "TEACHER");

        /* * ΠΕΡΙΠΤΩΣΗ 1: Ο χρήστης είναι ADMIN (Διευθυντής).
         * Επειδή ο Admin δεν υπάρχει στον πίνακα των Teachers, δίνουμε σταθερές τιμές.
         */
        if (role.contains("ADMIN")) {
            details.put("firstName", "Διευθυντής");
            details.put("lastName", "Σχολείου");
            return details;
        }

        /* * ΠΕΡΙΠΤΩΣΗ 2: Ο χρήστης είναι TEACHER.
         * Αναζητούμε τον εκπαιδευτικό στη βάση δεδομένων μέσω του email (username)
         * για να βρούμε το ID του και το τμήμα στο οποίο είναι υπεύθυνος.
         */
        if (role.contains("TEACHER")) {
            teacherRepository.findByEmail(username).ifPresent(teacher -> {
                details.put("id", teacher.getId());
                details.put("firstName", teacher.getFirstName());
                details.put("lastName", teacher.getLastName());

                // Αν ο εκπαιδευτικός είναι υπεύθυνος τμήματος, στέλνουμε τις πληροφορίες του τμήματος
                if (teacher.getClassroom() != null) {
                    Map<String, Object> cl = new HashMap<>();
                    cl.put("id", teacher.getClassroom().getId());
                    cl.put("name", teacher.getClassroom().getName());
                    details.put("classroom", cl);
                }
            });
        }
        return details;
    }
}