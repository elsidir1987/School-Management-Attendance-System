package com.eleni.school.repository;

import com.eleni.school.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository: GradeRepository
 * Σκοπός: Διαχείριση της επικοινωνίας με τον πίνακα "grades" στη MySQL.
 * Παρέχει τις απαραίτητες μεθόδους για την ανάκτηση και αποθήκευση των βαθμολογιών
 * χρησιμοποιώντας το Spring Data JPA.
 */
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    /**
     * Query Method: findByStudentId
     * Το Spring Data JPA αναλύει το όνομα της μεθόδου και δημιουργεί αυτόματα
     * το SQL ερώτημα: SELECT * FROM grades WHERE student_id = ?
     * * @param studentId Το μοναδικό αναγνωριστικό του μαθητή.
     * @return Μια λίστα με όλα τα αντικείμενα Grade που ανήκουν στον μαθητή.
     */
    List<Grade> findByStudentId(Long studentId);
}