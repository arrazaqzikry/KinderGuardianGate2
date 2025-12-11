package com.example.security.kinderguardiangate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Guardian guardian;

    private String status;

    private LocalDateTime timestamp;

    private String scannedIc;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Guardian getGuardian() { return guardian; }
    public void setGuardian(Guardian guardian) { this.guardian = guardian; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getScannedIc() { return scannedIc; }
    public void setScannedIc(String scannedIc) { this.scannedIc = scannedIc; }

    public String getGuardianNameFallback() {
        if (guardian != null) return guardian.getName();
        return "Unknown";
    }
}