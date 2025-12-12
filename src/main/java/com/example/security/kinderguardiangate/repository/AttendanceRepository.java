package com.example.security.kinderguardiangate.repository;

import com.example.security.kinderguardiangate.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate attendanceDate);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    void deleteByStudent_Id(Long studentId);
    List<Attendance> findByStudent_Id(Long studentId);
}