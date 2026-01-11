package com.eleni.school.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * Entity: Attendance
 * Σκοπός: Αντιπροσωπεύει τον πίνακα "attendance" στη βάση δεδομένων.
 * Καταγράφει την κατάσταση παρουσίας ενός μαθητή σε μια συγκεκριμένη ημερομηνία για ένα συγκεκριμένο τμήμα.
 */
@Entity
@Table(name = "attendance")
@Data // Lombok: Αυτόματο generation για getters, setters, toString και equals/hashCode
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Η ημερομηνία της καταγραφής (π.χ. 2024-05-20)
    private LocalDate date;

    // Κατάσταση: true για Παρών, false για Απών
    private boolean present;

    /**
     * Σχέση ManyToOne με τον Μαθητή.
     * Πολλές εγγραφές απουσιολογίου αντιστοιχούν σε έναν Μαθητή.
     * Το @JoinColumn ορίζει το Foreign Key "student_id" στον πίνακα attendance.
     */
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    /**
     * Σχέση ManyToOne με το Τμήμα.
     * Πολλές εγγραφές απουσιολογίου αντιστοιχούν σε ένα Τμήμα (Classroom).
     * Αυτό επιτρέπει τη γρήγορη ανάκτηση του ιστορικού μιας ολόκληρης τάξης.
     */
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    // --- Getters & Setters ---
    // Παρόλο που χρησιμοποιείται το @Data του Lombok, οι μέθοδοι ορίζονται ρητά
    // για απόλυτο έλεγχο και συμβατότητα με το Serialization.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }
}