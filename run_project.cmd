@echo off
echo Starting PG Accommodation System...

echo [1/7] Starting Eureka Server (Port 8761)...
start "Eureka Server" cmd /c "cd eureka-server && mvn spring-boot:run"

echo Waiting for Eureka Server to stabilize...
timeout /t 10 /nobreak

echo [2/7] Starting API Gateway (Port 8085)...
start "API Gateway" cmd /c "cd api-gateway && mvn spring-boot:run"

echo [3/7] Starting Auth Service (Port 8081)...
start "Auth Service" cmd /c "cd auth-service && mvn spring-boot:run"

echo [4/7] Starting User Service (Port 8083)...
start "User Service" cmd /c "cd user-service && mvn spring-boot:run"

echo [5/7] Starting PG Property Service (Port 8082)...
start "PG Property Service" cmd /c "cd pg-property-service && mvn spring-boot:run"

echo [6/7] Starting Booking Service (Port 8084)...
start "Booking Service" cmd /c "cd booking-service && mvn spring-boot:run"

echo [7/7] Starting Frontend Client (Port 3000)...
start "Frontend Client" cmd /c "cd client && npm start"

echo.
echo All services are starting in separate windows.
echo Please wait for them to initialize.
echo Eureka Dashboard: http://localhost:8761
echo Frontend: http://localhost:3000
pause
