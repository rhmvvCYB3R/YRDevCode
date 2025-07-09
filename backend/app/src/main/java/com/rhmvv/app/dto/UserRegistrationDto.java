package com.rhmvv.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @NotBlank
    private String username;

    @Email
    private String email;

    @NotBlank
    private String password;
}
