package com.geoblood.controller;

import com.geoblood.entity.HospitalProfile;
import com.geoblood.enums.VerificationStatus;
import com.geoblood.exception.ResourceNotFoundException;
import com.geoblood.repository.HospitalProfileRepository;
import com.geoblood.security.UserPrincipal;
import com.geoblood.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final HospitalProfileRepository hospitalProfileRepository;
    private final AuditService auditService;

    public AdminController(HospitalProfileRepository hospitalProfileRepository, AuditService auditService) {
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.auditService = auditService;
    }

    @GetMapping("/verifications")
    public ResponseEntity<List<Map<String, Object>>> getPendingVerifications() {
        List<HospitalProfile> pending = hospitalProfileRepository.findByVerificationStatus(VerificationStatus.PENDING);
        List<Map<String, Object>> result = new ArrayList<>();

        for (HospitalProfile hp : pending) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(hp.getId()));
            map.put("type", "HOSPITAL");
            map.put("name", hp.getFacilityName());
            map.put("licenseNumber", hp.getLicenseNumber());
            map.put("address", hp.getAddress());
            map.put("contactPhone", hp.getContactPhone());
            map.put("status", hp.getVerificationStatus().name());
            map.put("submittedAt", hp.getCreatedAt().toString());
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/verifications/{id}")
    public ResponseEntity<Map<String, Object>> updateVerification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String action = body.get("action");
        HospitalProfile hp = hospitalProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification record not found: " + id));

        VerificationStatus newStatus = "APPROVE".equalsIgnoreCase(action)
                ? VerificationStatus.APPROVED
                : VerificationStatus.REJECTED;

        hp.setVerificationStatus(newStatus);
        hospitalProfileRepository.save(hp);

        auditService.log(
                currentUser != null ? currentUser.getId() : null,
                currentUser != null ? currentUser.getEmail() : "admin",
                "ADMIN_VERIFICATION_" + newStatus.name(),
                "HospitalProfile",
                String.valueOf(hp.getId()),
                "Hospital verification updated to: " + newStatus.name()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Account verification " + newStatus.name().toLowerCase() + ".");

        Map<String, Object> verificationData = new HashMap<>();
        verificationData.put("id", String.valueOf(hp.getId()));
        verificationData.put("status", hp.getVerificationStatus().name());
        verificationData.put("resolvedAt", Instant.now().toString());
        response.put("verification", verificationData);

        return ResponseEntity.ok(response);
    }
}
