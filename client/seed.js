const axios = require('axios');

const API_URL = 'http://localhost:8085/api';

const pgs = [
    {
        name: 'Sai PG for Boys',
        address: '123 Main St, Sector 15',
        city: 'Noida',
        state: 'UP',
        pincode: '201301',
        landmark: 'Near Metro',
        latitude: 28.5355,
        longitude: 77.3910,
        description: 'A comfortable PG for boys with all amenities.',
        totalRooms: 10,
        availableRooms: 5,
        pricePerBed: 6000.00,
        depositAmount: 6000.00,
        foodIncluded: true,
        acAvailable: true,
        wifiAvailable: true,
        laundryAvailable: false,
        pgType: 'MALE_ONLY'
    },
    {
        name: 'Elite PG for Girls',
        address: '456 High Road, Sector 62',
        city: 'Noida',
        state: 'UP',
        pincode: '201309',
        landmark: 'Near Fortis Hospital',
        latitude: 28.6139,
        longitude: 77.2090,
        description: 'Premium girls PG with strict security.',
        totalRooms: 15,
        availableRooms: 2,
        pricePerBed: 8500.00,
        depositAmount: 8500.00,
        foodIncluded: true,
        acAvailable: true,
        wifiAvailable: true,
        laundryAvailable: true,
        pgType: 'FEMALE_ONLY'
    },
    {
        name: 'Urban Nest Co-living',
        address: '789 Tech Boulevard, HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102',
        landmark: 'Near BDA Complex',
        latitude: 12.9121,
        longitude: 77.6446,
        description: 'Modern co-living space for professionals.',
        totalRooms: 20,
        availableRooms: 10,
        pricePerBed: 12000.00,
        depositAmount: 24000.00,
        foodIncluded: false,
        acAvailable: true,
        wifiAvailable: true,
        laundryAvailable: true,
        pgType: 'UNISEX'
    },
    {
        name: 'Cozy Stay PG',
        address: '101 MG Road, Camp',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        landmark: 'Near SGS Mall',
        latitude: 18.5204,
        longitude: 73.8567,
        description: 'Budget friendly PG in the heart of the city.',
        totalRooms: 5,
        availableRooms: 1,
        pricePerBed: 4500.00,
        depositAmount: 4500.00,
        foodIncluded: true,
        acAvailable: false,
        wifiAvailable: true,
        laundryAvailable: false,
        pgType: 'MALE_ONLY'
    },
    {
        name: 'Sunrise Accommodations',
        address: '202 Sunrise Avenue, Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400069',
        landmark: 'Near Station',
        latitude: 19.0760,
        longitude: 72.8777,
        description: 'Affordable stays with quick transit access.',
        totalRooms: 8,
        availableRooms: 3,
        pricePerBed: 9000.00,
        depositAmount: 15000.00,
        foodIncluded: false,
        acAvailable: true,
        wifiAvailable: false,
        laundryAvailable: false,
        pgType: 'FEMALE_ONLY'
    },
    {
        name: 'Greenwood Co-Living',
        address: 'Plot 44, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500032',
        landmark: 'Near DLF Cyber City',
        latitude: 17.4455,
        longitude: 78.3619,
        description: 'Spacious rooms with a nice park view.',
        totalRooms: 12,
        availableRooms: 4,
        pricePerBed: 7500.00,
        depositAmount: 10000.00,
        foodIncluded: true,
        acAvailable: true,
        wifiAvailable: true,
        laundryAvailable: true,
        pgType: 'UNISEX'
    }
];

async function seed() {
    try {
        // Register owner
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username: 'pgowner1',
                password: 'password123',
                email: 'owner@test.com',
                phone: '9999999999',
                userType: 'OWNER',
                fullName: 'PG Owner One'
            });
            console.log("Owner registered");
        } catch (e) { console.log("Owner likely already exists"); }

        // Login
        const res = await axios.post(`${API_URL}/auth/login`, {
            username: 'pgowner1',
            password: 'password123'
        });
        const token = res.data.token || res.data;
        console.log("Logged in successfully");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Get user details
        const meRes = await axios.get(`${API_URL}/users/me`, config);
        const ownerId = meRes.data.userId || meRes.data.id;

        for (let pg of pgs) {
            pg.ownerId = ownerId;
            await axios.post(`${API_URL}/pg-properties`, pg, config);
            console.log(`Created PG: ${pg.name}`);
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Error during seeding:", err.response?.data || err.message);
    }
}

seed();
