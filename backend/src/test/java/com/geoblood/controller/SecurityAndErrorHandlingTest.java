package com.geoblood.controller;

import com.geoblood.security.CustomUserDetailsService;
import com.geoblood.security.JwtTokenProvider;
import com.geoblood.security.UserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityAndErrorHandlingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("Unauthenticated request to protected endpoint returns 401 with standardized JSON")
    void testUnauthenticatedAccessReturns401() throws Exception {
        mockMvc.perform(get("/api/donors/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", is("Authentication required")));
    }

    @Test
    @DisplayName("Role mismatch returns 403 Forbidden with standardized JSON")
    void testRoleMismatchReturns403() throws Exception {
        UserPrincipal donorPrincipal = (UserPrincipal) userDetailsService.loadUserByUsername("donor@test.com");
        String donorToken = "Bearer " + jwtTokenProvider.generateToken(donorPrincipal);

        // Donor attempting to access Admin endpoint
        mockMvc.perform(get("/api/admin/verifications")
                        .header("Authorization", donorToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }
}
