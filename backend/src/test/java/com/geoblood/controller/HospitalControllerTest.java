package com.geoblood.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoblood.dto.HospitalProfileRequest;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class HospitalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    private String hospitalToken;

    @BeforeEach
    void setUp() {
        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername("hospital@test.com");
        hospitalToken = "Bearer " + jwtTokenProvider.generateToken(principal);
    }

    @Test
    @DisplayName("GET /api/hospital/profile returns hospital profile for authenticated hospital")
    void testGetHospitalProfile() throws Exception {
        mockMvc.perform(get("/api/hospital/profile")
                        .header("Authorization", hospitalToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.facilityName", is("City Care Hospital")))
                .andExpect(jsonPath("$.verificationStatus", is("APPROVED")))
                .andExpect(jsonPath("$.contactPhone", is("+91 22 2847 0000")));
    }

    @Test
    @DisplayName("POST /api/hospital/profile updates hospital details successfully")
    void testUpdateHospitalProfile() throws Exception {
        HospitalProfileRequest req = new HospitalProfileRequest(
                "City Care Super-Speciality Hospital",
                "HOSP-MUM-2024-981",
                "Central Avenue, Sector 4, Mumbai",
                19.0760,
                72.8777,
                "+91 22 2847 9999",
                "+91 98200 99999"
        );

        mockMvc.perform(post("/api/hospital/profile")
                        .header("Authorization", hospitalToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.facilityName", is("City Care Super-Speciality Hospital")))
                .andExpect(jsonPath("$.contactPhone", is("+91 22 2847 9999")));
    }

    @Test
    @DisplayName("POST /api/hospital/profile with blank facilityName returns 400 validation error")
    void testUpdateHospitalProfileValidationFailure() throws Exception {
        HospitalProfileRequest req = new HospitalProfileRequest(
                "", // Blank
                "LIC-123",
                "Address",
                19.0,
                72.0,
                "+91 22 1234 5678",
                null
        );

        mockMvc.perform(post("/api/hospital/profile")
                        .header("Authorization", hospitalToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.errors.facilityName", notNullValue()));
    }
}
