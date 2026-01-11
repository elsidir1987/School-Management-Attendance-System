package com.eleni.school.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entity: Student
 * Σκοπός: Αναπαριστά έναν μαθητή στη βάση δεδομένων.
 * Περιλαμβάνει προσωπικά στοιχεία, στοιχεία επικοινωνίας γονέων και τη σχέση με το τμήμα.
 */
@Entity
@Table(name = "students")
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    // Πρόσθετα πεδία για την καρτέλα μαθητή
    @Column(length = 500)
    private String comments;      // Παιδαγωγικές σημειώσεις
    private String parentPhone;   // Τηλέφωνο γονέα (χρησιμοποιείται για WhatsApp/Viber)
    private String address;       // Διεύθυνση κατοικίας
    private String gender;        // Φύλο
    private String studentIdNumber; // Αριθμός Μητρώου
    private LocalDate birthDate;  // Ημερομηνία Γέννησης

    /**
     * Σχέση ManyToOne με το Classroom.
     * Πολλοί μαθητές ανήκουν σε ένα τμήμα.
     * - FetchType.EAGER: Φορτώνει αυτόματα το τμήμα μαζί με τον μαθητή (χρήσιμο για το Frontend).
     * - @JsonIgnoreProperties("students"): Αποτρέπει το "Circular Reference" (ατέρμονο loop)
     * κατά τη μετατροπή σε JSON, αγνοώντας τη λίστα μαθητών μέσα στο τμήμα.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "classroom_id")
    @JsonIgnoreProperties("students")
    private Classroom classroom;


    // --- Helper Methods ---

    /**
     * Εξειδικευμένος Setter για το Classroom.
     * Διασφαλίζει ότι η αμφίδρομη σχέση συγχρονίζεται σωστά και στις δύο πλευρές (Student & Classroom).
     */
    public void setClassroom(Classroom classroom) {
        // 1. Αφαίρεση του μαθητή από τη λίστα του προηγούμενου τμήματος
        if (this.classroom != null) {
            this.classroom.getStudents().remove(this);
        }

        // 2. Ανάθεση του νέου τμήματος
        this.classroom = classroom;

        // 3. Ενημέρωση της λίστας του νέου τμήματος
        if (classroom != null && !classroom.getStudents().contains(this)) {
            classroom.getStudents().add(this);
        }
    }

    // --- Getters & Setters ---
    // (Ο κώδικας περιλαμβάνει όλες τις απαραίτητες μεθόδους πρόσβασης για τα πεδία)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Classroom getClassroom() { return classroom; }
}