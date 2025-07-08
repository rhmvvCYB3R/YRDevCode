package com.rhmvv.app.websocket;

import com.rhmvv.app.dto.MessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public MessageDto sendMessage(MessageDto message) {
        // Можно добавить дополнительную логику (сохранение в БД, фильтры и т.п.)
        return message;
    }
}
