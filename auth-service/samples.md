# API Testing Samples (Postman/cURL)

## 1. Registration
**Endpoint**: `POST /api/auth/register`

### Admin Registration
```json
{
  "username": "admin_pg",
  "email": "admin@pgaccom.com",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "phoneNumber": "9876543210",
  "role": "ADMIN"
}
```

### Owner Registration
```json
{
  "username": "owner_john",
  "email": "john@pgowners.com",
  "password": "Secure@Owner1",
  "confirmPassword": "Secure@Owner1",
  "phoneNumber": "8887776665",
  "role": "OWNER"
}
```

### Tenant Registration
```json
{
  "username": "tenant_smith",
  "email": "smith@gmail.com",
  "password": "Smith@Tenant2",
  "confirmPassword": "Smith@Tenant2",
  "phoneNumber": "7776665554",
  "role": "TENANT"
}
```

---

## 2. Login
**Endpoint**: `POST /api/auth/login`

### Login with Username
```json
{
  "identifier": "admin_pg",
  "password": "Password@123"
}
```

### Login with Email
```json
{
  "identifier": "smith@gmail.com",
  "password": "Smith@Tenant2"
}
```

### Invalid Credentials (Example)
```json
{
  "identifier": "unknown_user",
  "password": "WrongPassword1"
}
```
**Response (401/400)**:
```json
{
  "message": "Invalid username/email or password"
}
```
