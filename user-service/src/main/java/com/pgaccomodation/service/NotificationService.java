package com.pgaccomodation.service;

import java.util.List;

import com.pgaccomodation.entity.Notification;

public interface NotificationService {
    Notification createNotification(Integer userId, String message);
    List<Notification> getUserNotifications(Integer userId);
    List<Notification> getUnreadNotifications(Integer userId);
    Notification markAsRead(Integer notificationId);
    void markAllAsRead(Integer userId);
}
