package com.rhmvv.app.dto;

import com.rhmvv.app.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;

    // Пустой конструктор — нужен для Jackson
    public UserProfileDto() {
    }

    // Конструктор для создания из сущности User
    public UserProfileDto(User user) {
        this.id = user.getId();
        this.name = user.getUsername(); // или getName()
        this.email = user.getEmail();
        this.role = user.getRole(); // если role — Enum
    }
}
