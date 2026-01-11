package com.eleni.school.repository;

import com.eleni.school.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository: TeacherRepository
 * Σκοπός: Διαχείριση της πρόσβασης στα δεδομένα των εκπαιδευτικών.
 * Παρέχει τη γέφυρα μεταξύ της βάσης δεδομένων και του CustomUserDetailsService
 * για τη διαδικασία του Authentication.
 */
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    /**
     * Αναζήτηση εκπαιδευτικού με βάση το email του.
     * Χρησιμοποιείται κατά το Login για να διαπιστωθεί αν ο χρήστης υπάρχει.
     * * @param email Το email που εισάγει ο χρήστης.
     * @return Ένα Optional<Teacher>, το οποίο βοηθά στην αποφυγή NullPointerExceptions
     * αν ο χρήστης δεν βρεθεί.
     */
    Optional<Teacher> findByEmail(String email);
}