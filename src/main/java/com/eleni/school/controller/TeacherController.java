package com.eleni.school.controller;

import com.eleni.school.model.Classroom;
import com.eleni.school.model.Teacher;
import com.eleni.school.repository.ClassroomRepository;
import com.eleni.school.repository.TeacherRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TeacherController {
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    public TeacherController(TeacherRepository teacherRepository, ClassroomRepository classroomRepository) {
        this.teacherRepository = teacherRepository;
        this.classroomRepository = classroomRepository;
    }


    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @PostMapping
    @Transactional
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        if (teacher.getClassroom() != null && teacher.getClassroom().getId() != null) {
            // Φέρνουμε το πραγματικό τμήμα από τη βάση για να αποφύγουμε σφάλματα σύνδεσης
            Classroom classroom = classroomRepository.findById(teacher.getClassroom().getId())
                    .orElseThrow(() -> new RuntimeException("Classroom not found"));
            teacher.setClassroom(classroom);
        }
        return teacherRepository.save(teacher);
    }

    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setFirstName(teacherDetails.getFirstName());
        teacher.setLastName(teacherDetails.getLastName());
        teacher.setSpecialty(teacherDetails.getSpecialty());
        teacher.setEmail(teacherDetails.getEmail());
        teacher.setClassroom(teacherDetails.getClassroom());

        return teacherRepository.save(teacher);
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherRepository.deleteById(id);
    }
}