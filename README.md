# 🚗 VASUNDHARA — Smart Travel & Ride Coordination Platform

VASUNDHARA is a full-stack smart travel and ride coordination platform designed to make road trips more organized, connected, and safer.

The platform combines **trip planning, route calculation, live location sharing, ride circles, halts, events, messaging, notifications, and vehicle management** into a single application.

---

## ✨ Features

### 🔐 Authentication & User Management

* User registration and login
* JWT-based authentication
* Protected API routes
* User profile management
* Secure password handling

### 🗺️ Smart Trip Planning

* Create and manage trips
* Start and destination locations
* Route calculation
* Distance and route information
* Trip status management
* Trip editing and deletion

### 📍 Maps & Routing

* OpenStreetMap integration
* OSRM routing engine
* Location/geocoding support
* Route and distance calculation
* Location-based trip planning

### 📡 Live Location

* Browser/device geolocation
* Real-time location updates
* Socket.IO-based communication
* Designed for coordinating users during trips

### 👥 Ride Circles

* Create ride circles
* Join existing circles
* Manage circle members
* Coordinate people travelling together
* Real-time communication support

### 🛑 Smart Halts

* Add and manage trip halts
* Organize planned stops during journeys
* Halt-related trip information
* Smart Halt architecture for future automation/IVR integration

> **Note:** IVR functionality is currently implemented as a stub and can be integrated with an external IVR provider in a future version.

### 💬 Messaging

* User-to-user communication
* Real-time communication infrastructure
* Socket.IO integration

### 🔔 Notifications

* User notifications
* Trip/community-related notifications
* Backend notification APIs

### 📅 Events

* Create and manage events
* Browse active events
* Community-oriented event functionality

### 🚘 Vehicle Management

* Add vehicles
* Update vehicle information
* Delete vehicles
* Manage user vehicle data

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript
* REST API integration
* Browser Geolocation API

### Backend

* Node.js
* Express.js
* REST APIs
* Socket.IO
* JWT Authentication
* Helmet
* CORS
* Morgan
* Express Rate Limit

### Database

* MongoDB
* Mongoose

### Maps & Routing

* OpenStreetMap
* OSRM

### Development Tools

* Git & GitHub
* npm
* Postman
* Linux/macOS CLI

---

## 🧩 Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Vite + Tailwind   │
                    └──────────┬──────────┘
                               │
                    REST API / Socket.IO
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
         ┌─────────┐     ┌────────────┐    ┌──────────┐
         │ MongoDB │     │  Socket.IO │    │  OSRM    │
         │Mongoose │     │ Real-time  │    │ Routing  │
         └─────────┘     └────────────┘    └──────────┘
                                               │
                                               ▼
                                         OpenStreetMap
```

---

## 📁 Project Structure

```text
saksham-fullstack-2/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/VASUNDHARA-tiwari-dot/SmartTravel-Platform
cd SmartTravel
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
OSRM_BASE_URL=https://router.project-osrm.org
```

### ⚠️ Security

Never commit `.env` to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.*
node_modules/
dist/
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

Expected response:

```json
{
  "ok": true,
  "service": "VASUNDHARA-backend"
}
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

## 🌱 Seed Demo Data

The backend includes a seed script for creating demo data.

```bash
cd backend
npm run seed
npm run dev
```

A demo account is created by the seed process.

> For security, use the credentials generated/configured by your local seed setup rather than publishing credentials in this README.


## 🔄 Real-Time Architecture

The application uses **Socket.IO** alongside the Express REST API.

This enables real-time functionality such as:

* Live location updates
* Ride-circle communication
* Real-time events
* Messaging infrastructure
* Trip coordination

Both REST APIs and Socket.IO run through the backend server.

---

## 🗺️ Routing

The project uses:

**OpenStreetMap** for map/location data and **OSRM** for route calculation.

Routing flow:

```text
User enters locations
        ↓
Location / Geocoding
        ↓
OSRM Routing API
        ↓
Route + Distance
        ↓
Frontend Map / Trip
```

---

## 🛡️ Backend Security

The backend includes several security and reliability measures:

* JWT authentication
* Protected routes
* Helmet security headers
* CORS configuration
* Express rate limiting
* JSON request limits
* Password hashing
* Centralized error handling
* Environment-based configuration

---

## 🚀 Future Improvements

Potential improvements include:

* Advanced trip recommendations
* AI-powered route planning
* Automatic halt recommendations
* Weather-aware route planning
* Traffic-aware routing
* Emergency/SOS functionality
* External IVR integration
* Push notifications
* Offline trip support
* Advanced ride matching
* Trip expense splitting
* Fuel cost estimation
* Driver/passenger verification
* Admin dashboard
* Analytics dashboard
* Production-grade deployment and monitoring

---

## 📌 Project Status

**Development / MVP**

The core full-stack architecture is implemented with:

* React frontend
* Express backend
* MongoDB database
* JWT authentication
* REST APIs
* Socket.IO
* Map/routing integration
* Trip and ride-circle functionality

Some advanced functionality, such as external IVR integration and additional intelligent travel features, can be expanded in future versions.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

## 📄 License

This project is currently intended for educational, development, and demonstration purposes.

---

## 👨‍💻 Developer

**VASUNDHARA Tiwari**

* GitHub: [VASUNDHARA-tiwari-dot](https://github.com/VASUNDHARA-tiwari-dot)
* LinkedIn: [VASUNDHARA Tiwari](https://www.linkedin.com/in/VASUNDHARA-tiwari-4226a03a4/?isSelfProfile=true)

---

⭐ If you find this project useful, consider giving it a star!
