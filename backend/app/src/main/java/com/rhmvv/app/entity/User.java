package com.rhmvv.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;


    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String role; // Например, "USER", "ADMIN"
}
