package com.eleni.school.controller;

import com.eleni.school.model.Grade;
import com.eleni.school.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: GradeController
 * Σκοπός: Διαχείριση των βαθμολογιών των μαθητών.
 * Συνδέεται με το GradeService για την εκτέλεση των λειτουργιών CRUD
 * και εξυπηρετεί τα αιτήματα που έρχονται από την καρτέλα μαθητή στο React.
 */
@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:3000") // Επιτρέπει την επικοινωνία με το React Frontend
public class GradeController {

    @Autowired
    private GradeService gradeService;

    /**
     * POST: Αποθήκευση ή Ενημέρωση Βαθμού.
     * Δέχεται ένα αντικείμενο Grade σε μορφή JSON και το προωθεί στο Service.
     * Χρησιμοποιεί το ResponseEntity για να επιστρέψει σωστά HTTP status codes.
     * @param grade Το αντικείμενο του βαθμού (περιλαμβάνει τιμή, μάθημα, τετράμηνο και student_id).
     * @return Ο αποθηκευμένος βαθμός με το ID που πήρε από τη βάση.
     */
    @PostMapping
    public ResponseEntity<Grade> addGrade(@RequestBody Grade grade) {
        // Καλούμε το Service το οποίο περιέχει τη λογική για save ή update
        return ResponseEntity.ok(gradeService.saveOrUpdateGrade(grade));
    }

    /**
     * GET: Λήψη όλων των βαθμών ενός συγκεκριμένου μαθητή.
     * Χρησιμοποιείται για να "γεμίσει" ο πίνακας βαθμολογίας στην καρτέλα του μαθητή
     * και για τη δημιουργία του PDF ελέγχου προόδου.
     * @param studentId Το μοναδικό ID του μαθητή.
     * @return Λίστα με όλους τους βαθμούς του μαθητή για όλα τα μαθήματα και τετράμηνα.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getStudentGrades(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudent(studentId));
    }

    /**
     * DELETE: Διαγραφή βαθμού.
     * Επιτρέπει στον εκπαιδευτικό να αφαιρέσει μια λανθασμένη καταχώρηση.
     * @param id Το ID της εγγραφής του βαθμού που πρόκειται να διαγραφεί.
     * @return Response 204 No Content, υποδεικνύοντας επιτυχή διαγραφή χωρίς επιστροφή δεδομένων.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }
}