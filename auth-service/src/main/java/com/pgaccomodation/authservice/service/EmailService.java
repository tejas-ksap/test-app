package com.pgaccomodation.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendResetToken(String to, String token) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Token for " + to + ": " + token);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@pgaccomodation.com");
            message.setTo(to);
            message.setSubject("Password Reset Token");
            message.setText("Your password reset token is: " + token + "\nIt will expire in 15 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
