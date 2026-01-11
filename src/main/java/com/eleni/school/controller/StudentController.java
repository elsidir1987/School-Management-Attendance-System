package com.eleni.school.controller;

import com.eleni.school.model.Classroom;
import com.eleni.school.model.Student;
import com.eleni.school.repository.ClassroomRepository;
import com.eleni.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller: StudentController
 * Σκοπός: Πλήρης διαχείριση του μαθητολογίου.
 * Παρέχει endpoints για την εγγραφή μαθητών, την αναζήτηση, την επεξεργασία στοιχείων
 * και την οργάνωση των μαθητών ανά σχολικό τμήμα.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    /**
     * Ανάκτηση όλων των μαθητών.
     * Χρησιμοποιείται κυρίως από τον Admin για τη συνολική προβολή του σχολείου.
     */
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Εγγραφή νέου μαθητή στη βάση δεδομένων.
     * @param student Το αντικείμενο του μαθητή που έρχεται από τη φόρμα της React.
     */
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    /**
     * Διαγραφή μαθητή μέσω του ID του.
     */
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    /**
     * Αναζήτηση μαθητών με βάση το επώνυμο.
     * Χρησιμοποιεί το "ContainingIgnoreCase" για να επιστρέφει αποτελέσματα
     * ανεξάρτητα από κεφαλαία/πεζά ή αν το κείμενο είναι μέρος του επωνύμου.
     */
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String lastName) {
        return studentRepository.findByLastNameContainingIgnoreCase(lastName);
    }

    /**
     * Ενημέρωση βασικών στοιχείων μαθητή (Όνομα, Επώνυμο, Email, Τμήμα).
     * @param id Το ID του μαθητή προς επεξεργασία.
     * @param studentDetails Τα νέα δεδομένα από το Frontend.
     */
    @PutMapping("/{id}")
    @Transactional // Εξασφαλίζει ότι η ενημέρωση στη βάση θα ολοκληρωθεί ως μία αδιαίρετη ενέργεια
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());

        // Δυναμική ανάθεση τμήματος: Φέρνουμε το αντικείμενο Classroom από τη βάση
        // για να διατηρήσουμε το Integrity των δεδομένων (Foreign Key).
        if (studentDetails.getClassroom() != null) {
            Classroom newClassroom = classroomRepository.findById(studentDetails.getClassroom().getId())
                    .orElseThrow(() -> new RuntimeException("Classroom not found"));
            student.setClassroom(newClassroom);
        } else {
            student.setClassroom(null); // Αφαίρεση μαθητή από τμήμα
        }

        return studentRepository.save(student);
    }

    /**
     * Ενημέρωση δευτερευόντων στοιχείων (Σημειώσεις, Τηλέφωνο, Διεύθυνση).
     * Χρησιμοποιεί Map για "Partial Update", δηλαδή ενημερώνει μόνο τα πεδία που στάλθηκαν.
     */
    @PutMapping("/{id}/details")
    @Transactional
    public Student updateStudentDetails(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Μαθητής δεν βρέθηκε"));

        // Έλεγχος ύπαρξης κλειδιών στο Map για αποφυγή NullPointerExceptions
        if (updates.containsKey("comments")) {
            student.setComments(updates.get("comments"));
        }
        if (updates.containsKey("parentPhone")) {
            student.setParentPhone(updates.get("parentPhone"));
        }
        if (updates.containsKey("address")) {
            student.setAddress(updates.get("address"));
        }

        return studentRepository.save(student);
    }

    /**
     * Ανάκτηση της λίστας μαθητών ενός συγκεκριμένου τμήματος.
     * Χρησιμοποιείται από τον εκπαιδευτικό για να δει το "δικό του" τμήμα.
     */
    @GetMapping("/classroom/{classroomId}")
    public List<Student> getStudentsByClassroom(@PathVariable Long classroomId) {
        return studentRepository.findByClassroomId(classroomId);
    }
}