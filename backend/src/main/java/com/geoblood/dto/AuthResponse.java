package com.geoblood.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String token;
    private UserDto user;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public AuthResponse(String token, UserDto user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }

    public static AuthResponse ofLogin(String token, UserDto user) {
        return new AuthResponse(token, user);
    }

    public static AuthResponse ofRegister(String message, UserDto user) {
        AuthResponse res = new AuthResponse();
        res.setMessage(message);
        res.setUser(user);
        return res;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
