package com.eleni.school.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
    @Table(name = "students")
    @NoArgsConstructor
    @AllArgsConstructor
    public class Student {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(length = 500)
        private String comments;
        private String studentIdNumber;
        private LocalDate birthDate;
        private String address;
        private String gender;

    public String getStudentIdNumber() {
        return studentIdNumber;
    }

    public void setStudentIdNumber(String studentIdNumber) {
        this.studentIdNumber = studentIdNumber;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getAddress() {
        return address;
    }

    public String getGender() {
        return gender;
    }

    public void setComments(String comments) {
            this.comments = comments;
        }

        public void setParentPhone(String parentPhone) {
            this.parentPhone = parentPhone;
        }

        public String getComments() {
            return comments;
        }

        public String getParentPhone() {
            return parentPhone;
        }

        private String parentPhone;

        public Long getId() {
            return id;
        }

        public String getLastName() {
            return lastName;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getEmail() {
            return email;
        }

        public Classroom getClassroom() {
            return classroom;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        private String firstName;
        private String lastName;
        private String email;

        @ManyToOne(fetch = FetchType.EAGER) // Σιγουρέψου ότι είναι EAGER για να φορτώνει αμέσως το τμήμα
        @JoinColumn(name = "classroom_id")
        @JsonIgnoreProperties("students")
        private Classroom classroom;

        public void setClassroom(Classroom classroom) {
            // 1. Αφαίρεση από το παλιό τμήμα (αν υπήρχε)
            if (this.classroom != null) {
                this.classroom.getStudents().remove(this);
            }

            // 2. Ανάθεση του νέου τμήματος
            this.classroom = classroom;

            // 3. Προσθήκη στη λίστα του νέου τμήματος (αν δεν είναι null)
            if (classroom != null && !classroom.getStudents().contains(this)) {
                classroom.getStudents().add(this);
            }
        }
    }

