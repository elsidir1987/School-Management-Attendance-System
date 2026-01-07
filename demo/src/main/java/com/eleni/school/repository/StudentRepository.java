package com.eleni.school.repository;

import com.eleni.school.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
    public interface StudentRepository extends JpaRepository<Student, Long> {
            // Αναζήτηση που αγνοεί μικρά/κεφαλαία και βρίσκει μέρος του ονόματος
            List<Student> findByLastNameContainingIgnoreCase(String lastName);

            long countByClassroomId(Long classroomId);
            List<Student> findByClassroomId(Long classroomId);
    }

