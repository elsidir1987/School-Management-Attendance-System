package com.eleni.school.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

/**
 * Entity: Teacher
 * Σκοπός: Αναπαριστά έναν εκπαιδευτικό στη βάση δεδομένων.
 * Χρησιμοποιείται τόσο για την αποθήκευση στοιχείων του προσωπικού όσο και
 * για την ταυτοποίηση (Login) μέσω του email.
 */
@Entity
@Table(name = "teachers")
@NoArgsConstructor // Απαραίτητο για το Hibernate
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Χρήση @JsonProperty για ρητό ορισμό των ονομάτων στο JSON που στέλνουμε στο React
    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("specialty")
    private String specialty; // Π.χ. ΠΕ70, ΠΕ86

    @JsonProperty("email")
    private String email;

    /**
     * Σχέση OneToOne με το Classroom.
     * Ορίζει ποιο τμήμα διαχειρίζεται ο εκπαιδευτικός.
     * - nullable = true: Επιτρέπει σε εκπαιδευτικούς ειδικοτήτων να μην έχουν δικό τους τμήμα.
     * - @JsonIgnoreProperties: Αποτρέπει το "Circular Reference" αγνοώντας τη λίστα μαθητών
     * και τον δάσκαλο μέσα στο αντικείμενο classroom κατά τη μετατροπή σε JSON.
     */
    @OneToOne
    @JoinColumn(name = "classroom_id", nullable = true)
    @JsonIgnoreProperties({"students", "teacher"})
    private Classroom classroom;

    // --- Getters & Setters ---
    // Εξασφαλίζουν την πρόσβαση στα δεδομένα από το Spring και το Jackson Serializer

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }
}