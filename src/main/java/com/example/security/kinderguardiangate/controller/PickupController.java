package com.example.security.kinderguardiangate.controller;

import com.example.security.kinderguardiangate.DTO.PickupDTO;
import com.example.security.kinderguardiangate.service.PickupService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PickupController {
    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @GetMapping("/index")
    public String home() {
        return "index";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboard() { return "dashboard";}

    @GetMapping("/scanlogs")
    public String scanlogs() { return "scanlogs";}

    @GetMapping("/parent")
    public String parent() {
        return "parent";
    }

    @GetMapping("/children")
    public String children() {
        return "children";
    }
    @PostMapping("/verify")
    public PickupDTO verifyPickup(@RequestParam Long studentId,
                                  @RequestParam String guardianIc) {
        return pickupService.verifyPickup(studentId, guardianIc);
    }
}
