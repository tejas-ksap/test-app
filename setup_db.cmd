@echo off
set DB_NAME=pg_accommodation
set DB_USER=root
set DB_PASS=160702

echo Creating database %DB_NAME%...
mysql -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

if %ERRORLEVEL% EQU 0 (
    echo Database created or already exists.
    echo Inserting dummy data from insert_dummy_data.sql...
    mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < insert_dummy_data.sql
    if %ERRORLEVEL% EQU 0 (
        echo Dummy data inserted successfully.
    ) else (
        echo Error inserting dummy data.
    )
) else (
    echo Error creating database. Please check your MySQL connection and credentials.
)

pause
