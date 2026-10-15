package com.geoblood.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoblood.dto.DonationRecordRequest;
import com.geoblood.entity.DonorProfile;
import com.geoblood.repository.DonorProfileRepository;
import com.geoblood.security.CustomUserDetailsService;
import com.geoblood.security.JwtTokenProvider;
import com.geoblood.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DonationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private DonorProfileRepository donorProfileRepository;

    private String hospitalToken;
    private Long donorId;

    @BeforeEach
    void setUp() {
        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername("hospital@test.com");
        hospitalToken = "Bearer " + jwtTokenProvider.generateToken(principal);

        DonorProfile donor = donorProfileRepository.findAll().get(0);
        donorId = donor.getId();
    }

    @Test
    @DisplayName("POST /api/donations records outcome and returns 201")
    void testRecordDonationSuccess() throws Exception {
        DonationRecordRequest req = new DonationRecordRequest(
                1L,
                donorId,
                1,
                "2026-10-15T10:00:00Z",
                "Successfully fulfilled and cross-matched in pathology lab."
        );

        mockMvc.perform(post("/api/donations")
                        .header("Authorization", hospitalToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message", containsString("Donation outcome recorded successfully")))
                .andExpect(jsonPath("$.donation.unitsDonated", is(1)))
                .andExpect(jsonPath("$.donation.certificateId", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/donations with invalid units or missing fields returns 400")
    void testRecordDonationValidationFailure() throws Exception {
        DonationRecordRequest req = new DonationRecordRequest(
                null, // Missing requestId
                null, // Missing donorId
                -5, // Invalid negative units
                null,
                null
        );

        mockMvc.perform(post("/api/donations")
                        .header("Authorization", hospitalToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.errors.requestId", notNullValue()))
                .andExpect(jsonPath("$.errors.donorId", notNullValue()))
                .andExpect(jsonPath("$.errors.unitsDonated", notNullValue()));
    }
}
