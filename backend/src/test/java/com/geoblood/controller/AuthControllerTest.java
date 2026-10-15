package com.geoblood.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoblood.dto.LoginRequest;
import com.geoblood.dto.RegisterRequest;
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
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register creates user and returns 201")
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest(
                "Ananya Joshi",
                "ananya@test.com",
                "password123",
                "DONOR"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message", containsString("Account created successfully")))
                .andExpect(jsonPath("$.user.name", is("Ananya Joshi")))
                .andExpect(jsonPath("$.user.email", is("ananya@test.com")))
                .andExpect(jsonPath("$.user.role", is("DONOR")));
    }

    @Test
    @DisplayName("POST /api/auth/register with duplicate email returns 400")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest req = new RegisterRequest(
                "Duplicate Aarav",
                "donor@test.com", // Already seeded in DataInitializer
                "password123",
                "DONOR"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("already exists")))
                .andExpect(jsonPath("$.errors.email", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/register with invalid data returns 400 and validation errors")
    void testRegisterValidationFailure() throws Exception {
        RegisterRequest req = new RegisterRequest(
                "", // Blank name
                "invalid-email", // Bad email
                "123", // Too short
                "INVALID_ROLE"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.errors.name", notNullValue()))
                .andExpect(jsonPath("$.errors.email", notNullValue()))
                .andExpect(jsonPath("$.errors.password", notNullValue()))
                .andExpect(jsonPath("$.errors.role", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/login returns token and user payload for valid credentials")
    void testLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest("donor@test.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("donor@test.com")))
                .andExpect(jsonPath("$.user.role", is("DONOR")));
    }

    @Test
    @DisplayName("POST /api/auth/login returns 401 for incorrect password")
    void testLoginFailureBadPassword() throws Exception {
        LoginRequest req = new LoginRequest("donor@test.com", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")))
                .andExpect(jsonPath("$.errors.credentials", notNullValue()));
    }
}
