package com.eleni.school.controller;

import com.eleni.school.model.Classroom;
import com.eleni.school.repository.ClassroomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: ClassroomController
 * Σκοπός: Διαχείριση των δεδομένων που αφορούν τα σχολικά τμήματα.
 * Παρέχει τη δυνατότητα ανάκτησης όλων των τάξεων, η οποία χρησιμοποιείται
 * από τον Admin για τη γενική εικόνα και από τις φόρμες εγγραφής μαθητών/εκπαιδευτικών.
 */
@RestController
@RequestMapping("/api/classrooms")
// Ρύθμιση Cross-Origin για την επικοινωνία με τη React εφαρμογή
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    /**
     * Constructor Injection:
     * Προτιμάται αντί του @Autowired στα πεδία, καθώς καθιστά την κλάση
     * πιο εύκολη στον έλεγχο (testing) και εξασφαλίζει ότι το repository είναι immutable (final).
     */
    public ClassroomController(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    /**
     * Ανάκτηση όλων των τμημάτων.
     * Επιστρέφει μια λίστα αντικειμένων Classroom, τα οποία περιλαμβάνουν
     * (λόγω των JPA σχέσεων) πληροφορίες για τον υπεύθυνο δάσκαλο και τους μαθητές.
     * * @return List<Classroom> Η πλήρης λίστα των τμημάτων από τη βάση δεδομένων.
     */
    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }
}