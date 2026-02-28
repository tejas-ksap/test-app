USE pg_accommodation;

-- Clear existing data (optional, but good for a clean start)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE pg_properties;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Users (Password is 'password123' for all)
-- BCrypt for 'password123': $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07Ofu.a.S6p7.vH.6.
INSERT INTO users (username, password, email, phone, full_name, user_type, is_active) VALUES 
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07Ofu.a.S6p7.vH.6.', 'admin@dummy.com', '1234567890', 'System Admin', 'ADMIN', true),
('owner1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07Ofu.a.S6p7.vH.6.', 'owner1@dummy.com', '1234567891', 'Property Owner 1', 'OWNER', true),
('tenant1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07Ofu.a.S6p7.vH.6.', 'tenant1@dummy.com', '1234567892', 'Sample Tenant 1', 'TENANT', true);

-- Insert Properties (Referencing owner1 as ID 2 likely)
INSERT INTO pg_properties (owner_id, name, address, city, state, pincode, landmark, latitude, longitude, description, total_rooms, available_rooms, price_per_bed, deposit_amount, food_included, ac_available, wifi_available, laundry_available, pg_type, rating, verified, created_at, updated_at) VALUES 
(2, 'Sai PG for Boys', '123 Main St, Sector 15', 'Noida', 'UP', '201301', 'Near Metro', 28.5355, 77.3910, 'A comfortable PG for boys with all amenities.', 10, 5, 6000.00, 6000.00, true, true, true, false, 'MALE_ONLY', 4.5, true, NOW(), NOW()),
(2, 'Elite PG for Girls', '456 High Road, Sector 62', 'Noida', 'UP', '201309', 'Near Fortis Hospital', 28.6139, 77.2090, 'Premium girls PG with strict security.', 15, 2, 8500.00, 8500.00, true, true, true, true, 'FEMALE_ONLY', 4.8, true, NOW(), NOW()),
(2, 'Urban Nest Co-living', '789 Tech Boulevard, HSR Layout', 'Bangalore', 'Karnataka', '560102', 'Near BDA Complex', 12.9121, 77.6446, 'Modern co-living space for professionals.', 20, 10, 12000.00, 24000.00, false, true, true, true, 'UNISEX', 4.2, true, NOW(), NOW()),
(2, 'Cozy Stay PG', '101 MG Road, Camp', 'Pune', 'Maharashtra', '411001', 'Near SGS Mall', 18.5204, 73.8567, 'Budget friendly PG in the heart of the city.', 5, 1, 4500.00, 4500.00, true, false, true, false, 'MALE_ONLY', 3.9, false, NOW(), NOW()),
(2, 'Sunrise Accommodations', '202 Sunrise Avenue, Andheri East', 'Mumbai', 'Maharashtra', '400069', 'Near Station', 19.0760, 72.8777, 'Affordable stays with quick transit access.', 8, 3, 9000.00, 15000.00, false, true, false, false, 'FEMALE_ONLY', 4.1, true, NOW(), NOW());
