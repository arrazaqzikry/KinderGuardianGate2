package com.example.security.kinderguardiangate.controller;

import com.example.security.kinderguardiangate.model.ScanLog;
import com.example.security.kinderguardiangate.repository.ScanLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scanlog")
public class ScanLogController {

    private final ScanLogRepository logRepo;

    public ScanLogController(ScanLogRepository logRepo) {
        this.logRepo = logRepo;
    }

    @GetMapping
    public List<ScanLog> getAllScanLogs() {
        return logRepo.findAll();
    }

    @RestController
    @RequestMapping("/api/pickups")
    public class PickupController {

        private final ScanLogRepository scanLogRepo;

        public PickupController(ScanLogRepository scanLogRepo) {
            this.scanLogRepo = scanLogRepo;
        }

        @GetMapping
        public List<Map<String, Object>> getAllPickups() {
            return scanLogRepo.findAll().stream().map(log -> {
                Map<String, Object> map = new HashMap<>();

                map.put("guardianName", log.getGuardianNameFallback());

                map.put("parentIC", log.getGuardian() != null ? log.getGuardian().getIcNumber() : log.getScannedIc());

                String studentName = (log.getStatus().equals("UNAUTHORIZED") || log.getStudent() == null) ? "-" : log.getStudent().getName();
                map.put("studentName", studentName);

                map.put("status", log.getStatus());
                map.put("timestamp", log.getTimestamp());
                return map;
            }).toList();
        }

    }

}
