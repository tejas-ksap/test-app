# PG Accommodation System - Sequence Diagrams

![Visual Sequence Diagram of PG Booking Flow](C:\Users\Shruti\.gemini\antigravity\brain\0749e8ab-3262-4f37-99b3-a61779c82261\pg_booking_sequence_visual_1776011059259.png)

This document contains sequence diagrams illustrating the core interaction flows within the PG Accommodation microservices architecture.

## 1. Authentication Flow
This diagram shows how a user (Tenant/Owner/Admin) authenticates with the system to obtain a JWT token.

```mermaid
sequenceDiagram
    actor User
    participant Client as React Dashboard
    participant Gateway as API Gateway (8085)
    participant Auth as Auth Service (8081)
    participant DB as MySQL (pg_accommodation)

    User->>Client: Enter Credentials
    Client->>Gateway: POST /api/auth/login
    Gateway->>Auth: Forward to Auth Service
    Auth->>DB: findByUsername(username)
    DB-->>Auth: User Entity (with encoded password)
    Auth->>Auth: Validate Password / Authenticate
    Auth->>Auth: Generate JWT Token
    Auth-->>Gateway: AuthResponse (token)
    Gateway-->>Client: 200 OK (token)
    Client->>Client: Store Token in localStorage
    Client-->>User: Redirect to Dashboard
```

---

## 2. Property Discovery Flow
This flow illustrates how users browse and search for PG properties across the platform.

```mermaid
sequenceDiagram
    actor User
    participant Client as React Dashboard
    participant Gateway as API Gateway (8085)
    participant Property as PG Property Service (8082)
    participant DB as MySQL (pg_accommodation)

    User->>Client: Search PGs (e.g., by City)
    Client->>Gateway: GET /api/pg-properties/city/{city} (with JWT)
    Gateway->>Gateway: Validate JWT
    Gateway->>Property: Forward Search Request
    Property->>DB: findByCity(city)
    DB-->>Property: List of PG Properties
    Property-->>Gateway: List<PgProperty>
    Gateway-->>Client: 200 OK (JSON)
    Client-->>User: Display PG Listings
```

---

## 3. Booking and Payment Flow
This is the most critical flow, involving transaction management, availability updates, and cross-service notifications.

```mermaid
sequenceDiagram
    actor Tenant
    participant Client as React Dashboard
    participant Gateway as API Gateway (8085)
    participant Booking as Booking Service (8084)
    participant Property as PG Property Service (8082)
    participant UserSvc as User Service (8083)
    participant DB as MySQL (pg_accommodation)

    Tenant->>Client: Click "Book Now" (Pay Deposit)
    Client->>Client: Trigger Razorpay Modal
    Tenant->>Client: Complete Payment
    Client->>Gateway: POST /api/bookings (booking info + razorpay_id)
    Gateway->>Booking: Forward Booking Request
    
    rect rgb(240, 240, 240)
    Note over Booking, DB: Transaction Begins
    Booking->>DB: Check PgProperty Availability
    DB-->>Booking: pg_property row (shared DB)
    
    alt Vacancy Available
        Booking->>DB: Decrement available_rooms
        Booking->>DB: Save Booking record (status: CONFIRMED)
        Booking->>DB: Save Payment record (status: SUCCESS)
        Booking->>UserSvc: POST /notifications (Notify Owner)
        UserSvc-->>Booking: 200 OK
        Booking-->>Gateway: Saved Booking Entity
        Gateway-->>Client: 201 Created
        Client-->>Tenant: Show Booking Confirmation
    else No Vacancy
        Booking-->>Gateway: 400 Bad Request (No vacancies)
        Gateway-->>Client: Error Message
        Client-->>Tenant: Display "Fully Booked"
    end
    end
```

## Description of Interactions

- **Shared Database**: In this architecture, while services are separate, they currently share a single MySQL schema (`pg_accommodation`) for core data like `PgProperty`, which allows the `Booking Service` to perform availability checks and updates efficiently.
- **API Gateway**: Acts as the central security layer, validating JWT tokens before forwarding requests to downstream microservices.
- **User Service (Notifications)**: The `Booking Service` uses a `NotificationClient` (calling `user-service`) to alert the PG owner when a new guaranteed booking is made.
- **Payment Integration**: The frontend handles the active payment session with Razorpay, passing the resulting `payment_id` to the backend for verification and record-keeping during the booking creation process.
