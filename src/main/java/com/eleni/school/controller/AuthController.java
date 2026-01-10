package com.eleni.school.controller;

import com.eleni.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TeacherRepository teacherRepository;

    @GetMapping("/me")
    public Map<String, Object> getAccountDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = new HashMap<>();

        String username = auth.getName();
        String role = auth.getAuthorities().toString();

        details.put("username", username);
        details.put("role", role.contains("ADMIN") ? "ADMIN" : "TEACHER");

        // Αν είναι ADMIN, δίνουμε σταθερά στοιχεία και σταματάμε εδώ
        if (role.contains("ADMIN")) {
            details.put("firstName", "Διευθυντής");
            details.put("lastName", "Σχολείου");
            return details;
        }

        // Αν είναι TEACHER, ψάχνουμε στη βάση όπως πριν
        if (role.contains("TEACHER")) {
            teacherRepository.findByEmail(username).ifPresent(teacher -> {
                details.put("id", teacher.getId());
                details.put("firstName", teacher.getFirstName());
                details.put("lastName", teacher.getLastName());

                if (teacher.getClassroom() != null) {
                    Map<String, Object> cl = new HashMap<>();
                    cl.put("id", teacher.getClassroom().getId());
                    cl.put("name", teacher.getClassroom().getName());
                    details.put("classroom", cl);
                }
            });
        }
        return details;
    }
}