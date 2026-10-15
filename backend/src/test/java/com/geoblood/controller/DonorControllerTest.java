package com.geoblood.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoblood.dto.AvailabilityUpdateRequest;
import com.geoblood.dto.DonorProfileRequest;
import com.geoblood.dto.NotificationPrefsDto;
import com.geoblood.enums.BloodGroup;
import com.geoblood.security.JwtTokenProvider;
import com.geoblood.security.UserPrincipal;
import com.geoblood.security.CustomUserDetailsService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DonorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    private String donorToken;

    @BeforeEach
    void setUp() {
        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername("donor@test.com");
        donorToken = "Bearer " + jwtTokenProvider.generateToken(principal);
    }

    @Test
    @DisplayName("GET /api/donors/me returns donor profile for authenticated donor")
    void testGetMyProfile() throws Exception {
        mockMvc.perform(get("/api/donors/me")
                        .header("Authorization", donorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Aarav Sharma")))
                .andExpect(jsonPath("$.bloodGroup", is("O+")))
                .andExpect(jsonPath("$.isAvailable", is(true)))
                .andExpect(jsonPath("$.locationArea", is("Andheri West, Mumbai")));
    }

    @Test
    @DisplayName("POST /api/donors updates donor profile successfully")
    void testUpdateDonorProfile() throws Exception {
        DonorProfileRequest req = new DonorProfileRequest(
                "Aarav Sharma",
                BloodGroup.O_POS,
                "Andheri West, Mumbai",
                "+91 98765 43210",
                19.1136,
                72.8697,
                new NotificationPrefsDto(true, false, true)
        );

        mockMvc.perform(post("/api/donors")
                        .header("Authorization", donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bloodGroup", is("O+")))
                .andExpect(jsonPath("$.locationArea", is("Andheri West, Mumbai")))
                .andExpect(jsonPath("$.notificationPrefs.smsAlerts", is(false)));
    }

    @Test
    @DisplayName("POST /api/donors with out-of-range coordinates returns 400 validation error")
    void testUpdateDonorProfileInvalidCoordinates() throws Exception {
        DonorProfileRequest req = new DonorProfileRequest(
                "Aarav Sharma",
                BloodGroup.O_POS,
                "Andheri West",
                "+91 98765 43210",
                999.0, // Invalid latitude
                -250.0, // Invalid longitude
                null
        );

        mockMvc.perform(post("/api/donors")
                        .header("Authorization", donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.errors.latitude", notNullValue()))
                .andExpect(jsonPath("$.errors.longitude", notNullValue()));
    }

    @Test
    @DisplayName("PATCH /api/donors/me/availability toggles availability")
    void testToggleAvailability() throws Exception {
        AvailabilityUpdateRequest req = new AvailabilityUpdateRequest(false);

        mockMvc.perform(patch("/api/donors/me/availability")
                        .header("Authorization", donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.isAvailable", is(false)))
                .andExpect(jsonPath("$.message", containsString("UNAVAILABLE")));
    }

    @Test
    @DisplayName("GET /api/donors/me/donations returns donation history")
    void testGetDonationHistory() throws Exception {
        mockMvc.perform(get("/api/donors/me/donations")
                        .header("Authorization", donorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].bloodGroup", is("O+")))
                .andExpect(jsonPath("$[0].certificateId", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/donors/me/invitations returns invitations list")
    void testGetInvitations() throws Exception {
        mockMvc.perform(get("/api/donors/me/invitations")
                        .header("Authorization", donorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].hospitalName", is("City Care Hospital")))
                .andExpect(jsonPath("$[0].urgency", is("CRITICAL")));
    }
}
