package com.eleni.school.service;

import com.eleni.school.model.Grade;
import com.eleni.school.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service: GradeService
 * Σκοπός: Διαχείριση της επιχειρησιακής λογικής για τους βαθμούς των μαθητών.
 * Απομονώνει τις κλήσεις προς τη βάση δεδομένων και παρέχει μια καθαρή
 * διεπαφή (API) προς τον Controller.
 */
@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    /**
     * Αποθήκευση ή Ενημέρωση βαθμού.
     * Η μέθοδος .save() του Spring Data JPA είναι έξυπνη:
     * - Αν το αντικείμενο Grade δεν έχει ID, κάνει INSERT (νέα εγγραφή).
     * - Αν το αντικείμενο Grade έχει ήδη ID, κάνει UPDATE (ενημέρωση).
     * @param grade Το αντικείμενο του βαθμού προς επεξεργασία.
     */
    public Grade saveOrUpdateGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    /**
     * Λήψη βαθμών ανά μαθητή.
     * Καλεί το repository για να φέρει όλους τους βαθμούς που ανήκουν σε
     * ένα συγκεκριμένο studentId.
     */
    public List<Grade> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }

    /**
     * Διαγραφή βαθμού.
     * Επιτρέπει την αφαίρεση μιας εγγραφής βάσει του μοναδικού της ID.
     */
    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }
}