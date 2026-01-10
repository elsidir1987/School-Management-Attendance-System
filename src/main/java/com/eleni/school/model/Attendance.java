package com.eleni.school.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private boolean present;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setPresent(boolean present) {
        this.present = present;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public LocalDate getDate() {
        return date;
    }

    public boolean isPresent() {
        return present;
    }

    public Student getStudent() {
        return student;
    }

    public Classroom getClassroom() {
        return classroom;
    }
}