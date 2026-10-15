package com.geoblood.controller;

import com.geoblood.dto.*;
import com.geoblood.security.UserPrincipal;
import com.geoblood.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping("/me")
    public ResponseEntity<DonorProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        DonorProfileResponse response = donorService.getProfile(currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<DonorProfileResponse> createOrUpdateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DonorProfileRequest request) {
        DonorProfileResponse response = donorService.createOrUpdateProfile(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me/availability")
    public ResponseEntity<AvailabilityUpdateResponse> updateAvailability(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AvailabilityUpdateRequest request) {
        AvailabilityUpdateResponse response = donorService.updateAvailability(currentUser, request.getIsAvailable());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/me/donations", "/me/history"})
    public ResponseEntity<List<DonationRecordResponse>> getDonationHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<DonationRecordResponse> history = donorService.getDonationHistory(currentUser);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/me/invitations")
    public ResponseEntity<List<DonorInvitationResponse>> getInvitations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<DonorInvitationResponse> invitations = donorService.getInvitations(currentUser);
        return ResponseEntity.ok(invitations);
    }
}
