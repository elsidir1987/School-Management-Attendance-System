package com.eleni.school.controller;

import com.eleni.school.model.Classroom;
import com.eleni.school.model.Teacher;
import com.eleni.school.repository.ClassroomRepository;
import com.eleni.school.repository.TeacherRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: TeacherController
 * Σκοπός: Διαχείριση των εκπαιδευτικών του σχολείου.
 * Επιτρέπει στον Admin να προσθέτει, να ενημερώνει και να διαγράφει δασκάλους,
 * καθώς και να τους αναθέτει υπεύθυνους σε συγκεκριμένα τμήματα (Classrooms).
 */
@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    /**
     * Constructor Injection:
     * Η ενδεδειγμένη μέθοδος για την εισαγωγή των Repositories,
     * εξασφαλίζοντας ότι ο Controller είναι έτοιμος προς χρήση με όλες τις εξαρτήσεις του.
     */
    public TeacherController(TeacherRepository teacherRepository, ClassroomRepository classroomRepository) {
        this.teacherRepository = teacherRepository;
        this.classroomRepository = classroomRepository;
    }

    /**
     * Ανάκτηση όλων των εκπαιδευτικών.
     * Επιστρέφει τη λίστα των δασκάλων μαζί με την ειδικότητά τους και το τμήμα τους.
     */
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    /**
     * Προσθήκη νέου εκπαιδευτικού.
     * Περιλαμβάνει λογική επαλήθευσης για τη σύνδεση με το Classroom.
     * @param teacher Το αντικείμενο του εκπαιδευτικού από το Frontend.
     */
    @PostMapping
    @Transactional // Εξασφαλίζει την ακεραιότητα της εγγραφής αν υπάρξει σφάλμα στη σύνδεση με το Classroom
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        if (teacher.getClassroom() != null && teacher.getClassroom().getId() != null) {
            /* * Σημαντικό: Αν ο δάσκαλος ορίζεται ως υπεύθυνος τμήματος,
             * ανακτούμε το πλήρες Classroom entity από τη βάση για να διασφαλίσουμε
             * ότι το Foreign Key είναι έγκυρο.
             */
            Classroom classroom = classroomRepository.findById(teacher.getClassroom().getId())
                    .orElseThrow(() -> new RuntimeException("Το τμήμα δεν βρέθηκε"));
            teacher.setClassroom(classroom);
        }
        return teacherRepository.save(teacher);
    }

    /**
     * Ενημέρωση στοιχείων εκπαιδευτικού.
     * Επιτρέπει την αλλαγή ονόματος, ειδικότητας, email ή την ανάθεση νέου τμήματος.
     */
    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ο εκπαιδευτικός δεν βρέθηκε"));

        teacher.setFirstName(teacherDetails.getFirstName());
        teacher.setLastName(teacherDetails.getLastName());
        teacher.setSpecialty(teacherDetails.getSpecialty());
        teacher.setEmail(teacherDetails.getEmail());
        teacher.setClassroom(teacherDetails.getClassroom());

        return teacherRepository.save(teacher);
    }

    /**
     * Διαγραφή εκπαιδευτικού από το σύστημα.
     */
    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherRepository.deleteById(id);
    }
}