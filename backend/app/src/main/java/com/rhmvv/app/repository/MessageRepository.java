package com.rhmvv.app.repository;

import com.rhmvv.app.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTopicId(Long topicId);
}
