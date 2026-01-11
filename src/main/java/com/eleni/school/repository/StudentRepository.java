package com.eleni.school.repository;

import com.eleni.school.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository: StudentRepository
 * Σκοπός: Διαχείριση της επικοινωνίας με τον πίνακα "students" στη MySQL.
 * Παρέχει έτοιμες μεθόδους CRUD και εξειδικευμένα ερωτήματα για την αναζήτηση
 * και την οργάνωση των μαθητών ανά τμήμα.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Query Method: Αναζήτηση μαθητών με βάση το επώνυμο.
     * - Containing: Επιτρέπει την εύρεση αποτελεσμάτων ακόμα και με μέρος του ονόματος (τύπου LIKE %...%).
     * - IgnoreCase: Αγνοεί τη διάκριση πεζών/κεφαλαίων, κάνοντας την αναζήτηση πιο φιλική στον χρήστη.
     * @param lastName Το κείμενο αναζήτησης που πληκτρολογεί ο χρήστης στη React.
     */
    List<Student> findByLastNameContainingIgnoreCase(String lastName);

    /**
     * Επιστρέφει τον συνολικό αριθμό μαθητών που ανήκουν σε ένα συγκεκριμένο τμήμα.
     * Χρησιμοποιείται για τα στατιστικά του Dashboard (Teacher Stats).
     */
    long countByClassroomId(Long classroomId);

    /**
     * Ανακτά τη λίστα των μαθητών που ανήκουν σε ένα συγκεκριμένο τμήμα.
     * Είναι η βασική μέθοδος που τροφοδοτεί το "Απουσιολόγιο" και τη "Λίστα Τμήματος"
     * για τον εκπαιδευτικό.
     */
    List<Student> findByClassroomId(Long classroomId);
}