package com.eleni.school.repository;

import com.eleni.school.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassroomIdAndDate(Long classroomId, LocalDate date);
    long countByStudentIdAndPresentFalse(Long studentId);

    List<Attendance> findByStudentId(Long studentId);
}