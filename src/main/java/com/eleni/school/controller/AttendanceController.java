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

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/save-batch")
    public void saveAttendance(@RequestBody List<Attendance> attendanceList) {
        // Ορίζουμε τη σημερινή ημερομηνία για όλες τις εγγραφές
        attendanceList.forEach(a -> a.setDate(LocalDate.now()));
        attendanceRepository.saveAll(attendanceList);
    }

    @GetMapping("/history/{classroomId}/{date}")
    public List<Map<String, Object>> getAttendanceHistory(
            @PathVariable Long classroomId,
            @PathVariable String date) {

        LocalDate localDate = LocalDate.parse(date);

        // 1. Παίρνουμε όλους τους μαθητές του τμήματος
        List<Student> allStudents = studentRepository.findByClassroomId(classroomId);

        // 2. Παίρνουμε τις απουσίες που καταγράφηκαν εκείνη τη μέρα
        List<Attendance> dayAttendance = attendanceRepository.findByClassroomIdAndDate(classroomId, localDate);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Student student : allStudents) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", student.getId());
            row.put("firstName", student.getFirstName());
            row.put("lastName", student.getLastName());

            // Ψάχνουμε αν υπάρχει εγγραφή για αυτόν τον μαθητή τη συγκεκριμένη μέρα
            boolean isPresent = dayAttendance.stream()
                    .filter(a -> a.getStudent().getId().equals(student.getId()))
                    .map(Attendance::isPresent)
                    .findFirst()
                    .orElse(true); // Αν δεν υπάρχει εγγραφή, τον θεωρούμε παρόντα

            row.put("present", isPresent);
            result.add(row);
        }

        return result;
    }

    @GetMapping("/count-absences/{studentId}")
    public Long getStudentAbsences(@PathVariable Long studentId) {
        return attendanceRepository.countByStudentIdAndPresentFalse(studentId);
    }

    // AttendanceController.java

    @GetMapping("/teacher-stats/{classroomId}")
    public Map<String, Object> getTeacherStats(@PathVariable Long classroomId) {
        Map<String, Object> stats = new HashMap<>();

        // 1. Συνολικοί μαθητές στο τμήμα
        long totalStudents = studentRepository.countByClassroomId(classroomId);

        // 2. Απόντες σήμερα
        long absentToday = attendanceRepository.findByClassroomIdAndDate(classroomId, LocalDate.now())
                .stream().filter(a -> !a.isPresent()).count();

        // 3. Μαθητές που έχουν > 20 απουσίες (χρειάζεται ένα custom query στο Repository)
        // Για απλούστευση τώρα, ας στείλουμε τα βασικά
        stats.put("totalStudents", totalStudents);
        stats.put("absentToday", absentToday);

        return stats;
    }

    @GetMapping("/critical-students/{classroomId}")
    public List<Map<String, Object>> getCriticalStudents(@PathVariable Long classroomId) {
        // Φέρνουμε όλους τους μαθητές του τμήματος
        List<Student> students = studentRepository.findByClassroomId(classroomId);
        List<Map<String, Object>> criticalList = new ArrayList<>();

        for (Student s : students) {
            long count = attendanceRepository.countByStudentIdAndPresentFalse(s.getId());
            if (count >= 15) { // Όριο προειδοποίησης
                Map<String, Object> map = new HashMap<>();
                map.put("name", s.getFirstName() + " " + s.getLastName());
                map.put("absences", count);
                criticalList.add(map);
            }
        }
        return criticalList;
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getStudentAttendance(@PathVariable Long studentId) {
        // Θα χρειαστείς τη μέθοδο findByStudentId στο AttendanceRepository
        return attendanceRepository.findByStudentId(studentId);
    }
}