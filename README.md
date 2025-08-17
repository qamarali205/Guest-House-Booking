# 🏨 Guesthouse Booking API  

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)  
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)  
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)  
![JWT](https://img.shields.io/badge/Auth-JWT-orange)  

A **Guesthouse Booking REST API** built with **Node.js, Express.js, and MongoDB**.  
Supports **authentication, guesthouse management, room bookings, and dummy payments**.  

---

## ✨ Features
- 🔐 JWT-based Authentication (Register/Login)  
- 🏘️ Search Guesthouses (city + price filters)  
- 👨‍💼 Role-based Access (User & Admin)  
- 🛏️ Room Booking with Availability Check  
- 💳 Dummy Payment Simulation (Razorpay-style)  
- 📅 View My Bookings  
- ❌ Cancel Bookings (Bonus)  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Auth:** JSON Web Token (JWT)  
- **Payment:** Mock Payment API  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/guesthouse-booking-api.git
cd guesthouse-booking-api


2️⃣ Install Dependencies

npm install


3️⃣ Setup .env File

PORT = 5000
MONGO_URI = mongodb://localhost:27017/guesthouse-booking
JWT_SECRET = your_jwt_secret
JWT_EXPIRES_IN = 7d
RATE_LIMIT = 100

4️⃣ Run Development Server

npm run dev

Server runs at 👉 http://localhost:5000


📌 API Endpoints
🔑 Authentication

Register

POST /api/auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Login
POST /api/auth/login

{
  "email": "john@example.com",
  "password": "123456"
}

Get Guesthouses (with filters)

GET /api/guesthouses?city=Delhi&minPrice=1000&maxPrice=5000

Add Guesthouse (Admin only)

POST /api/guesthouses

{
  "name": "Hotel Paradise",
  "city": "Delhi",
  "address": "Connaught Place",
  "rooms": 10,
  "pricePerNight": 2500,
  "amenities": ["WiFi", "AC", "Breakfast"]
}


📅 Bookings
POST /api/bookings
{
  "guesthouseId": "68a18054c832da7a9ce4b12e",
  "startDate": "2025-08-20",
  "endDate": "2025-08-23"
}


Get My Bookings

GET /api/bookings/my

Cancel Booking 
PATCH /api/bookings/:id/cancel

💳 Payments

Initiate Payment

POST /api/payments/initiate

{
  "bookingId": "68a18054c832da7a9ce4b12f",
  "amount": 7500
}


POST /api/payments/verify

{
  "transactionId": "txn_12345",
  "status": true
}

📂 Project Structure

guest-house-booking/
│-- src/
    │-- config/        # DB & other configs
    │-- controllers/   # Route logic
    │-- middlewares/   # Auth, error handling
    │-- models/        # Mongoose schemas
    │-- routes/        # API routes
    │-- utils/         #jwt, validation etc
│-- index.js      # App entry point
│-- README.md      # Project docs
