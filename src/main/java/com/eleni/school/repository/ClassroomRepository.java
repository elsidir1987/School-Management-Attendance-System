package com.eleni.school.repository;

import com.eleni.school.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository: ClassroomRepository
 * Σκοπός: Παροχή πρόσβασης στα δεδομένα του πίνακα "classrooms".
 * Κληρονομεί όλες τις μεθόδους του JpaRepository, επιτρέποντας τη διαχείριση
 * των τμημάτων (ανάγνωση, αποθήκευση, διαγραφή) με ελάχιστο κώδικα.
 */
@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

}