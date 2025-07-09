package com.rhmvv.app.controller;

import com.rhmvv.app.dto.*;
import com.rhmvv.app.entity.User;
import com.rhmvv.app.security.CustomUserDetails;
import com.rhmvv.app.security.CustomUserDetailsService;
import com.rhmvv.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final UserService userService;

    @Operation(
            summary = "Register a new user",
            description = "Registers a user with the provided registration data",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User registered successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
            }
    )
    @PostMapping("/register")
    public String register(@RequestBody @Valid UserRegistrationDto dto) {
        userService.register(dto);
        return "User registered successfully";
    }

    @Operation(
            summary = "Authenticate user and obtain token",
            description = "Logs in user and returns authentication response",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful login",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Authentication failed", content = @Content)
            }
    )
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return userService.authenticate(request);
    }
    @Operation(
            summary = "Get current user's profile",
            description = "Returns the full profile of the authenticated user",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User profile retrieved successfully",
                            content = @Content(schema = @Schema(implementation = UserProfileDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "User is not authenticated",
                            content = @Content
                    )
            }
    )
    @GetMapping("/profile")
    public UserProfileDto getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return new UserProfileDto(userDetails.getUser());
    }
    @Operation(
            summary = "Update current user's profile",
            description = "Updates the profile of the authenticated user",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User profile updated successfully",
                            content = @Content(schema = @Schema(implementation = UserProfileDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input data",
                            content = @Content
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "User is not authenticated",
                            content = @Content
                    )
            }
    )
    @PutMapping("/profile")
    public UserProfileDto updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UserProfileDto dto
    ) {
        Long userId = userDetails.getUser().getId();
        User updatedUser = userService.updateUser(userId, dto);
        return new UserProfileDto(updatedUser);
    }

    @Operation(
            summary = "Delete current user's account",
            description = "Deletes the account of the authenticated user",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "204",
                            description = "User deleted successfully"
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "User is not authenticated",
                            content = @Content
                    )
            }
    )

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getId();
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
    @Operation(
            summary = "Change user password",
            description = "Allows authenticated user to change their password",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Password changed successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "401", description = "User is not authenticated"),
                    @ApiResponse(responseCode = "403", description = "Current password is incorrect")
            }
    )
    @PostMapping("/profile/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid PasswordChangeDto passwordChangeDto
    ) {
        userService.changePassword(userDetails.getUser().getId(), passwordChangeDto);
        return ResponseEntity.ok().build();
    }

}
