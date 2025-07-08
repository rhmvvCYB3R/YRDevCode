package com.rhmvv.app.service;

import com.rhmvv.app.dto.TopicDto;
import com.rhmvv.app.entity.Topic;
import com.rhmvv.app.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    public List<TopicDto> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(topic -> {
                    TopicDto dto = new TopicDto();
                    dto.setId(topic.getId());
                    dto.setTitle(topic.getTitle());
                    dto.setDescription(topic.getDescription());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public TopicDto createTopic(TopicDto dto) {
        Topic topic = new Topic();
        topic.setTitle(dto.getTitle());
        topic.setDescription(dto.getDescription());

        Topic saved = topicRepository.save(topic);

        dto.setId(saved.getId());
        return dto;
    }
}
