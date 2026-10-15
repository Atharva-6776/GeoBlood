package com.geoblood.controller;

import com.geoblood.dto.HospitalProfileRequest;
import com.geoblood.dto.HospitalProfileResponse;
import com.geoblood.security.UserPrincipal;
import com.geoblood.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/hospital", "/api/hospitals"})
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping({"/profile", "/me"})
    public ResponseEntity<HospitalProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        HospitalProfileResponse response = hospitalService.getProfile(currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"", "/profile"})
    public ResponseEntity<HospitalProfileResponse> createOrUpdateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody HospitalProfileRequest request) {
        HospitalProfileResponse response = hospitalService.createOrUpdateProfile(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<HospitalProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody HospitalProfileRequest request) {
        HospitalProfileResponse response = hospitalService.createOrUpdateProfile(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalProfileResponse> getProfileById(@PathVariable Long id) {
        HospitalProfileResponse response = hospitalService.getProfileById(id);
        return ResponseEntity.ok(response);
    }
}
