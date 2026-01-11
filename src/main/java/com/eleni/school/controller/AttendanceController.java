package com.eleni.school.controller;

import com.eleni.school.model.Attendance;
import com.eleni.school.model.Student;
import com.eleni.school.repository.AttendanceRepository;
import com.eleni.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller: AttendanceController
 * Σκοπός: Διαχείριση όλων των λειτουργιών που αφορούν τις παρουσίες και τις απουσίες.
 * Παρέχει endpoints για την αποθήκευση ημερήσιου απουσιολογίου, την ανάκτηση ιστορικού
 * και τον υπολογισμό στατιστικών για το Dashboard.
 */
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Μαζική αποθήκευση παρουσιολογίου.
     * Δέχεται μια λίστα από εγγραφές (μία για κάθε μαθητή) και ορίζει αυτόματα τη σημερινή ημερομηνία.
     * @param attendanceList Η λίστα με τις καταστάσεις (παρών/απών) των μαθητών.
     */
    @PostMapping("/save-batch")
    public void saveAttendance(@RequestBody List<Attendance> attendanceList) {
        attendanceList.forEach(a -> a.setDate(LocalDate.now())); // Εξασφαλίζουμε τη σωστή ημερομηνία στον server
        attendanceRepository.saveAll(attendanceList);
    }

    /**
     * Ανάκτηση ιστορικού για συγκεκριμένη ημερομηνία και τμήμα.
     * Συνδυάζει τη λίστα μαθητών με τις εγγραφές απουσιών για να δείξει την πλήρη εικόνα της τάξης.
     */
    @GetMapping("/history/{classroomId}/{date}")
    public List<Map<String, Object>> getAttendanceHistory(
            @PathVariable Long classroomId,
            @PathVariable String date) {

        LocalDate localDate = LocalDate.parse(date);
        List<Student> allStudents = studentRepository.findByClassroomId(classroomId);
        List<Attendance> dayAttendance = attendanceRepository.findByClassroomIdAndDate(classroomId, localDate);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Student student : allStudents) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", student.getId());
            row.put("firstName", student.getFirstName());
            row.put("lastName", student.getLastName());

            // Λογική αντιστοίχισης: Αν δεν υπάρχει εγγραφή στη βάση, το σύστημα θεωρεί τον μαθητή "Παρόντα"
            boolean isPresent = dayAttendance.stream()
                    .filter(a -> a.getStudent().getId().equals(student.getId()))
                    .map(Attendance::isPresent)
                    .findFirst()
                    .orElse(true);

            row.put("present", isPresent);
            result.add(row);
        }
        return result;
    }

    /**
     * Υπολογισμός συνολικών απουσιών ενός μαθητή.
     * Χρησιμοποιείται για την εμφάνιση του αριθμού στην καρτέλα του μαθητή.
     */
    @GetMapping("/count-absences/{studentId}")
    public Long getStudentAbsences(@PathVariable Long studentId) {
        return attendanceRepository.countByStudentIdAndPresentFalse(studentId);
    }

    /**
     * Παραγωγή στατιστικών για το Dashboard του εκπαιδευτικού.
     * Επιστρέφει τον συνολικό αριθμό μαθητών και τους απόντες της τρέχουσας ημέρας.
     */
    @GetMapping("/teacher-stats/{classroomId}")
    public Map<String, Object> getTeacherStats(@PathVariable Long classroomId) {
        Map<String, Object> stats = new HashMap<>();

        long totalStudents = studentRepository.countByClassroomId(classroomId);
        long absentToday = attendanceRepository.findByClassroomIdAndDate(classroomId, LocalDate.now())
                .stream().filter(a -> !a.isPresent()).count();

        stats.put("totalStudents", totalStudents);
        stats.put("absentToday", absentToday);

        return stats;
    }

    /**
     * Εντοπισμός μαθητών σε "κίνδυνο" λόγω απουσιών.
     * Ελέγχει όλους τους μαθητές και επιστρέφει όσους έχουν ξεπεράσει το όριο προειδοποίησης (15 απουσίες).
     */
    @GetMapping("/critical-students/{classroomId}")
    public List<Map<String, Object>> getCriticalStudents(@PathVariable Long classroomId) {
        List<Student> students = studentRepository.findByClassroomId(classroomId);
        List<Map<String, Object>> criticalList = new ArrayList<>();

        for (Student s : students) {
            long count = attendanceRepository.countByStudentIdAndPresentFalse(s.getId());
            if (count >= 15) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", s.getFirstName() + " " + s.getLastName());
                map.put("absences", count);
                criticalList.add(map);
            }
        }
        return criticalList;
    }

    /**
     * Επιστρέφει το πλήρες ιστορικό ενός μαθητή (για την κάρτα μαθητή στη React).
     */
    @GetMapping("/student/{studentId}")
    public List<Attendance> getStudentAttendance(@PathVariable Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
}