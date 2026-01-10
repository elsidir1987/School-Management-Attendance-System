package com.eleni.school.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classrooms")
@NoArgsConstructor
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int grade;

    @OneToOne(mappedBy = "classroom")
    private Teacher teacher;

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public String getName() {
        return name;
    }

    public int getGrade() {
        return grade;
    }

    public List<Student> getStudents() {
        return students;
    }

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Student> students = new ArrayList<>();

}
