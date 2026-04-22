# Movie Booking System - Interaction Flow

This diagram illustrates the sequence of interactions between the **User** and the **System** based on the provided use case diagram.

```mermaid
sequenceDiagram
    actor User
    participant System
    participant DB as Database

    rect rgb(240, 240, 240)
    Note over User, System: Authentication
    User->>System: Signup/Login Request
    System-->>User: Authentication Success
    end

    rect rgb(245, 245, 245)
    Note over User, System: Exploration
    User->>System: Search Movie (e.g., Search "Avengers")
    System->>DB: Log search history
    DB-->>System: History Logged
    System-->>User: Show Search Results

    User->>System: Get recommendation
    System-->>User: Provide recommendation (based on Search History)

    User->>System: View movie details
    System->>DB: Fetch movie information
    DB-->>System: Movie Metadata
    System-->>User: Display movie details
    end

    rect rgb(240, 240, 240)
    Note over User, System: Transaction & History
    User->>System: Book Tickets
    System->>DB: Store booking details
    DB-->>System: Transaction Successful
    System-->>User: Booking confirmed!

    User->>System: View booking history
    System->>DB: Fetch booking records
    DB-->>System: Records found
    System-->>User: Display booking history
    end
```

## Description of Flows

- **Authentication**: Covers the `Signup` and `Login` use cases.
- **Exploration**: Covers `Search Movie`, `Get recommendation`, and `View movie details`. Notice how the system logs search history and fetches information.
- **Transaction**: Covers `Book Tickets` and the underlying `Store booking details` operation.
- **History**: Covers `View booking history`.
