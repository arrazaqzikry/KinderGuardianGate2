package com.example.security.kinderguardiangate.controller;

import com.example.security.kinderguardiangate.DTO.PickupDTO;
import com.example.security.kinderguardiangate.service.PickupService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pickups")
public class PickupRestController {

    private final PickupService pickupService;

    public PickupRestController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping("/confirm")
    public PickupDTO confirmPickup(
            @RequestParam Long studentId,
            @RequestParam String guardianIc) {

        return pickupService.verifyPickup(studentId, guardianIc);
    }
}
