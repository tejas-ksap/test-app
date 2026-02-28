@echo off
echo Installing dependencies for all microservices...

set SERVICES=eureka-server api-gateway auth-service user-service pg-property-service booking-service

for %%s in (%SERVICES%) do (
    echo.
    echo ----------------------------------------------------
    echo [%%s] Installing Maven dependencies...
    cd %%s
    call mvn clean install -DskipTests
    cd ..
)

echo.
echo ----------------------------------------------------
echo [client] Installing NPM dependencies...
cd client
call npm install
cd ..

echo.
echo All dependencies installed successfully.
pause
