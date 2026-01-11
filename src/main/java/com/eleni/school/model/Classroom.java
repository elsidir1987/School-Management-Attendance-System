package com.eleni.school.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity: Classroom
 * Σκοπός: Αντιπροσωπεύει ένα σχολικό τμήμα (π.χ. Α1, Β2).
 * Λειτουργεί ως ο κεντρικός κόμβος που συνδέει Εκπαιδευτικούς και Μαθητές.
 */
@Entity
@Table(name = "classrooms")
@NoArgsConstructor // Απαραίτητο για το JPA για τη δημιουργία αντικειμένων μέσω Reflection
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Το όνομα του τμήματος (π.χ. "Α1")

    private int grade; // Ο αριθμός της τάξης (1 για Α', 2 για Β' κλπ)

    /**
     * Σχέση OneToOne με τον Εκπαιδευτικό.
     * Το "mappedBy" υποδεικνύει ότι η ιδιοκτησία της σχέσης ανήκει στην κλάση Teacher
     * (εκεί βρίσκεται το Foreign Key). Κάθε τμήμα έχει έναν υπεύθυνο δάσκαλο.
     */
    @OneToOne(mappedBy = "classroom")
    private Teacher teacher;

    /**
     * Σχέση OneToMany με τους Μαθητές.
     * Ένα τμήμα περιέχει πολλούς μαθητές.
     * - cascade = CascadeType.ALL: Ενέργειες στο τμήμα επηρεάζουν και τις εγγραφές των μαθητών.
     * - orphanRemoval = false: Αν διαγραφεί το τμήμα, δεν θέλουμε να διαγραφούν αυτόματα
     * οι μαθητές, αλλά να μείνουν "ορφανοί" ώστε να μετακινηθούν σε άλλο τμήμα.
     */
    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Student> students = new ArrayList<>();

    // --- Getters & Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getGrade() { return grade; }
    public void setGrade(int grade) { this.grade = grade; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public List<Student> getStudents() { return students; }
    public void setStudents(List<Student> students) { this.students = students; }
}