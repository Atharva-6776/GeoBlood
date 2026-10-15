package com.geoblood.service;

import com.geoblood.dto.AuthResponse;
import com.geoblood.dto.LoginRequest;
import com.geoblood.dto.RegisterRequest;
import com.geoblood.dto.UserDto;
import com.geoblood.entity.DonorProfile;
import com.geoblood.entity.HospitalProfile;
import com.geoblood.entity.User;
import com.geoblood.enums.Role;
import com.geoblood.exception.BadRequestException;
import com.geoblood.repository.DonorProfileRepository;
import com.geoblood.repository.HospitalProfileRepository;
import com.geoblood.repository.UserRepository;
import com.geoblood.security.JwtTokenProvider;
import com.geoblood.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final HospitalProfileRepository hospitalProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       DonorProfileRepository donorProfileRepository,
                       HospitalProfileRepository hospitalProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            Map<String, String> errors = new HashMap<>();
            errors.put("email", "Email is already registered");
            throw new BadRequestException("An account with this email address already exists.", errors);
        }

        Role role = Role.fromString(request.getRole());
        if (role == null || role == Role.ADMIN) {
            Map<String, String> errors = new HashMap<>();
            errors.put("role", "Role must be DONOR or HOSPITAL");
            throw new BadRequestException("Validation failed. Please correct the fields.", errors);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                request.getName().trim(),
                email,
                null,
                encodedPassword,
                role,
                true // Auto-verified for voluntary donor / default dev
        );
        User savedUser = userRepository.save(user);

        // Pre-create matching profile
        if (role == Role.DONOR) {
            DonorProfile profile = new DonorProfile(savedUser);
            donorProfileRepository.save(profile);
        } else if (role == Role.HOSPITAL) {
            HospitalProfile profile = new HospitalProfile(savedUser, savedUser.getName());
            hospitalProfileRepository.save(profile);
        }

        auditService.log(
                savedUser.getId(),
                savedUser.getEmail(),
                "USER_REGISTER",
                "User",
                String.valueOf(savedUser.getId()),
                "User registered with role: " + role.name()
        );

        UserDto userDto = new UserDto(
                String.valueOf(savedUser.getId()),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return AuthResponse.ofRegister("Account created successfully! You can now log in.", userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(userPrincipal);

        auditService.log(
                userPrincipal.getId(),
                userPrincipal.getEmail(),
                "USER_LOGIN",
                "User",
                String.valueOf(userPrincipal.getId()),
                "User logged in successfully"
        );

        UserDto userDto = new UserDto(
                String.valueOf(userPrincipal.getId()),
                userPrincipal.getName(),
                userPrincipal.getEmail(),
                userPrincipal.getRole().name()
        );

        return AuthResponse.ofLogin(token, userDto);
    }
}
