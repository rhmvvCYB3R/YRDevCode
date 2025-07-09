package com.rhmvv.app.dto;

import com.rhmvv.app.entity.User;
import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;

    public UserProfileDto(User user) {
        this.id = user.getId();
        this.name = user.getUsername(); // если есть поле name
        this.email = user.getEmail();
        this.role = user.getRole(); // если Enum, можно сделать .name()
    }
}
