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

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Προσθήκη νέου μαθητή
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // Διαγραφή μαθητή
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String lastName) {
        return studentRepository.findByLastNameContainingIgnoreCase(lastName);
    }

    @PutMapping("/{id}")
    @Transactional // Πρόσθεσε αυτό για να σιγουρέψεις ότι η αλλαγή θα γίνει "πακέτο" στη βάση
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());

        if (studentDetails.getClassroom() != null) {
            // Φέρνουμε το πλήρες αντικείμενο του τμήματος από τη βάση
            Classroom newClassroom = classroomRepository.findById(studentDetails.getClassroom().getId())
                    .orElseThrow(() -> new RuntimeException("Classroom not found"));
            student.setClassroom(newClassroom);
        } else {
            student.setClassroom(null);
        }

        return studentRepository.save(student);
    }


    @PutMapping("/{id}/details")
    @Transactional
    public Student updateStudentDetails(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Μαθητής με id " + id + " δεν βρέθηκε"));

        // Χρησιμοποιούμε if για να μην σβήσουμε κατά λάθος υπάρχοντα δεδομένα αν το updates είναι ελλιπές
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

    @GetMapping("/classroom/{classroomId}")
    public List<Student> getStudentsByClassroom(@PathVariable Long classroomId) {
        return studentRepository.findByClassroomId(classroomId);
    }
}