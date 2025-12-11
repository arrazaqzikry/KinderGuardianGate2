package com.example.security.kinderguardiangate.DTO;

import java.time.LocalDateTime;

public class PickupDTO {
    private String guardianName;
    private String parentIC;
    private String studentName;
    private LocalDateTime timestamp;
    private String status;
    private String attendanceStatus;

    public PickupDTO(String guardianName, String parentIC, String studentName, LocalDateTime timestamp, String status, String attendanceStatus) {
        this.guardianName = guardianName;
        this.parentIC = parentIC;
        this.studentName = studentName;
        this.timestamp = timestamp;
        this.status = status;
        this.attendanceStatus = attendanceStatus;
    }

    // getters
    public String getGuardianName() { return guardianName; }
    public String getParentIC() { return parentIC; }
    public String getStudentName() { return studentName; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
    public String getAttendanceStatus() { return attendanceStatus; }
}
