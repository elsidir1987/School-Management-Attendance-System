package com.eleni.school.model;

import com.eleni.school.model.Student;
import jakarta.persistence.*;

/**
 * Entity: Grade
 * Σκοπός: Αναπαριστά την καταχώρηση ενός βαθμού στη βάση δεδομένων.
 * Συνδέει την επίδοση (value) με ένα συγκεκριμένο μάθημα (subject),
 * μια χρονική περίοδο (term) και τον αντίστοιχο μαθητή.
 */
@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Η βαθμολογία του μαθητή (π.χ. 18, 20)
    private Integer value;

    // Η χρονική περίοδος (π.χ. "Α' Τετράμηνο", "Β' Τετράμηνο")
    private String term;

    // Το γνωστικό αντικείμενο (π.χ. "Μαθηματικά", "Φυσική")
    private String subject;

    /**
     * Σχέση ManyToOne με τον Μαθητή.
     * Πολλοί βαθμοί (για διαφορετικά μαθήματα/τετράμηνα) ανήκουν σε έναν μαθητή.
     * Το JoinColumn δημιουργεί το Foreign Key "student_id" στον πίνακα grades.
     */
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    // --- Getters & Setters ---
    // Απαραίτητα για το JPA και το Jackson (μετατροπή σε JSON για το React)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getValue() { return value; }
    public void setValue(Integer value) { this.value = value; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}