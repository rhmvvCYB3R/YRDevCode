package com.rhmvv.app.service;

import com.rhmvv.app.dto.MessageDto;
import com.rhmvv.app.entity.Message;
import com.rhmvv.app.entity.Topic;
import com.rhmvv.app.entity.User;
import com.rhmvv.app.repository.MessageRepository;
import com.rhmvv.app.repository.TopicRepository;
import com.rhmvv.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public List<MessageDto> getMessagesByTopicId(Long topicId) {
        List<Message> messages = messageRepository.findByTopicId(topicId);
        return messages.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public MessageDto saveMessage(Long topicId, String content, String userEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setContent(content);
        message.setTopic(topic);
        message.setSender(user);  // Исправлено под поле sender
        message.setSentAt(LocalDateTime.now());  // Исправлено под поле sentAt

        Message saved = messageRepository.save(message);
        return mapToDto(saved);
    }

    private MessageDto mapToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderUsername(message.getSender().getUsername());  // sender вместо user
        dto.setSentAt(message.getSentAt());  // sentAt вместо timestamp
        return dto;
    }
}
