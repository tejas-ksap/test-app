package com.pgaccommodation.pgpropertyservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

/**
 * Helper that fires notifications to user-service via REST.
 * Base URL: http://localhost:8083 (user-service)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationClient {

    private final RestTemplate restTemplate;

    /**
     * Send a notification to a specific user.
     * @param userId  the recipient's user ID in user-service
     * @param message human-readable notification text
     */
    public void sendNotification(Integer userId, String message) {
        try {
            URI url = UriComponentsBuilder.newInstance()
                    .scheme("http").host("localhost").port(8083)
                    .path("/api/users/{userId}/notifications")
                    .queryParam("message", message)
                    .buildAndExpand(userId)
                    .toUri();

            restTemplate.postForEntity(url, null, Void.class);
            log.info("Notification sent to user {}: {}", userId, message);
        } catch (Exception e) {
            log.error("Failed to send notification to user {}: {}", userId, e.getMessage());
        }
    }
}
