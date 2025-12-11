package com.example.security.kinderguardiangate.service;

import com.example.security.kinderguardiangate.DTO.PickupDTO;
import com.example.security.kinderguardiangate.model.Attendance;
import com.example.security.kinderguardiangate.model.Guardian;
import com.example.security.kinderguardiangate.model.ScanLog;
import com.example.security.kinderguardiangate.model.Student;
import com.example.security.kinderguardiangate.repository.AttendanceRepository;
import com.example.security.kinderguardiangate.repository.GuardianRepository;
import com.example.security.kinderguardiangate.repository.PickupLogRepository;
import com.example.security.kinderguardiangate.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PickupService {
    private final StudentRepository studentRepo;
    private final GuardianRepository guardianRepo;
    private final PickupLogRepository logRepo;
    private final AttendanceRepository attendanceRepo;

    public PickupService(StudentRepository studentRepo,
                         GuardianRepository guardianRepo,
                         PickupLogRepository logRepo,
                         AttendanceRepository attendanceRepo) {
        this.studentRepo = studentRepo;
        this.guardianRepo = guardianRepo;
        this.logRepo = logRepo;
        this.attendanceRepo = attendanceRepo;
    }

    public PickupDTO verifyPickup(Long studentId, String guardianIc) {
        Optional<Student> studentOpt = studentRepo.findById(studentId);
        Optional<Guardian> guardianOpt = guardianRepo.findByIcNumber(guardianIc);

        String parentName = guardianOpt.map(Guardian::getName).orElse("Unknown");
        String parentIC = guardianIc;
        String studentName = studentOpt.map(Student::getName).orElse("-");
        String attendanceStatus = "ABSENT";

        if (studentOpt.isPresent()) {
            Optional<Attendance> attendanceOpt = attendanceRepo.findByStudentIdAndAttendanceDate(studentId, LocalDate.now());
            if (attendanceOpt.isPresent() && attendanceOpt.get().getStatus() == Attendance.AttendanceStatus.PRESENT) {
                attendanceStatus = "PRESENT";
            }
        }

        if (studentOpt.isPresent() && guardianOpt.isPresent()) {
            Student student = studentOpt.get();
            Guardian guardian = guardianOpt.get();

            if (attendanceStatus.equals("ABSENT")) {
                ScanLog log = new ScanLog();
                log.setStudent(student);
                log.setGuardian(guardian);
                log.setStatus("ABSENT_BLOCK");
                log.setTimestamp(LocalDateTime.now());
                logRepo.save(log);

                return new PickupDTO(parentName, parentIC, studentName, LocalDateTime.now(), "UNAUTHORIZED", attendanceStatus);
            }

            if (student.getGuardians().contains(guardian)) {
                ScanLog log = new ScanLog();
                log.setStudent(student);
                log.setGuardian(guardian);
                log.setStatus("AUTHORIZED");
                log.setTimestamp(LocalDateTime.now());
                logRepo.save(log);

                return new PickupDTO(parentName, parentIC, studentName, LocalDateTime.now(), "AUTHORIZED", attendanceStatus);
            }
        }

        return new PickupDTO(parentName, parentIC, studentName, LocalDateTime.now(), "UNAUTHORIZED", attendanceStatus);
    }

}