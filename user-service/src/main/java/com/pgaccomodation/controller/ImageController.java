package com.pgaccomodation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pgaccomodation.entity.Image;
import com.pgaccomodation.service.ImageService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Upload an image
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Image savedImage = imageService.storeImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("imageKey", savedImage.getId());
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Serve an image (Publicly accessible)
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> serveImage(@PathVariable String id) {
        Optional<Image> imageOpt = imageService.getImage(id);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getName() + "\"")
                    .contentType(MediaType.valueOf(image.getType()))
                    .body(image.getData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
