package com.eleni.school.controller;

import com.eleni.school.model.Classroom;
import com.eleni.school.repository.ClassroomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    public ClassroomController(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }
}