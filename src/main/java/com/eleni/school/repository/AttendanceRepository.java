package com.eleni.school.repository;

import com.eleni.school.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository: AttendanceRepository
 * Σκοπός: Διαχείριση της πρόσβασης στα δεδομένα του πίνακα "attendance".
 * Επεκτείνει το JpaRepository για να παρέχει βασικές λειτουργίες CRUD
 * και εξειδικευμένα ερωτήματα (Query Methods) για το απουσιολόγιο.
 */
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    /**
     * Ανακτά όλες τις εγγραφές παρουσιολογίου για ένα συγκεκριμένο τμήμα και ημερομηνία.
     * Χρησιμοποιείται για την εμφάνιση του ιστορικού στην εφαρμογή.
     * @param classroomId Το ID του τμήματος.
     * @param date Η ημερομηνία αναζήτησης.
     */
    List<Attendance> findByClassroomIdAndDate(Long classroomId, LocalDate date);

    /**
     * Μετράει πόσες φορές ένας μαθητής έχει καταγραφεί ως "Απών" (present = false).
     * Είναι η μέθοδος που τροφοδοτεί το Progress Bar και τις προειδοποιήσεις για το όριο των 20 απουσιών.
     * @param studentId Το ID του μαθητή.
     * @return Ο συνολικός αριθμός απουσιών.
     */
    long countByStudentIdAndPresentFalse(Long studentId);

    /**
     * Επιστρέφει το πλήρες ιστορικό παρουσιών/απουσιών ενός συγκεκριμένου μαθητή.
     * Χρησιμοποιείται στην "Καρτέλα Μαθητή" για να δούμε αναλυτικά πότε έλειψε.
     */
    List<Attendance> findByStudentId(Long studentId);
}