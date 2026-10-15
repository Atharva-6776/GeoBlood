package com.geoblood.controller;

import com.geoblood.dto.DonationRecordRequest;
import com.geoblood.dto.DonationRecordResponse;
import com.geoblood.security.UserPrincipal;
import com.geoblood.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> recordDonation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DonationRecordRequest request) {
        DonationRecordResponse record = donationService.recordDonation(currentUser, request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Donation outcome recorded successfully.");
        response.put("donation", record);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
