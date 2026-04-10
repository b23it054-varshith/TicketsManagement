# TicketFlow — MERN Support Ticket Management System

A full-stack support ticket management system built with MongoDB, Express, React, and Node.js.

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone / Extract the project

```
Miniproject_MERN/
├── server/   ← Node.js + Express backend
└── client/   ← React (Vite) frontend
```

### 2. Configure the server

Edit `server/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticketsystem
JWT_SECRET=ticket_system_super_secret_jwt_key_2024_miniproject
JWT_REFRESH_SECRET=ticket_system_refresh_secret_key_2024_miniproject
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> Using MongoDB Atlas? Replace `MONGO_URI` with your Atlas connection string.

### 3. Install & run the server

```bash
cd server
npm install
npm run dev
```

Server starts at **http://localhost:5000**

### 4. Install & run the client

```bash
cd client
npm install
npm run dev
```

Client starts at **http://localhost:5173**

---

## Demo Accounts

Seed the database or register accounts manually. The login page shows:

| Role  | Email             | Password    |
|-------|-------------------|-------------|
| Admin | admin@demo.com    | password123 |
| Agent | agent@demo.com    | password123 |
| User  | user@demo.com     | password123 |

To create an admin account quickly, register normally then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@demo.com" }, { $set: { role: "admin" } })
```

---

## Features

### All Users
- Register / Login with JWT auth
- Create tickets with category, priority, description, attachments
- Real-time status updates via Socket.IO
- SLA countdown timer per ticket
- Comment/reply thread on each ticket
- Star rating after resolution
- Profile management with avatar upload
- Notification bell with real-time alerts
- Knowledge Base (FAQ)

### Agents
- View and manage assigned tickets
- Update ticket status (Open → In Progress → Resolved → Closed)
- Add internal notes (not visible to users)
- View own performance stats

### Admins
- Full dashboard with live stats and charts
- Assign/reassign tickets to agents
- Smart auto-assignment (round-robin by workload)
- User management (roles, activate/deactivate)
- Reports: category, priority, agent performance
- Knowledge Base article management
- Audit timeline per ticket

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 (Vite), React Router v6   |
| Styling   | Custom CSS (dark theme)             |
| Charts    | Recharts                            |
| Real-time | Socket.IO                           |
| HTTP      | Axios                               |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| Auth      | JWT (access + refresh tokens)       |
| Uploads   | Multer (local disk)                 |

---

## Project Structure

```
server/
├── config/db.js              # MongoDB connection
├── middleware/
│   ├── auth.js               # JWT protect + authorize
│   └── upload.js             # Multer file upload
├── models/
│   ├── User.js
│   ├── Ticket.js
│   ├── Comment.js
│   ├── Notification.js
│   └── KnowledgeBase.js
├── routes/
│   ├── auth.js
│   ├── tickets.js
│   ├── users.js
│   ├── notifications.js
│   └── knowledgebase.js
├── socket/socketHandler.js   # Socket.IO events
└── server.js

client/src/
├── components/
│   ├── dashboard/            # StatsCards, TicketChart, RecentActivity
│   ├── layout/               # Sidebar, Navbar, Layout
│   ├── notifications/        # NotificationPanel
│   ├── tickets/              # TicketCard, TicketForm, TicketTimeline
│   └── ui/                   # Badge, Modal, Loader
├── context/                  # AuthContext, SocketContext
├── hooks/                    # useTickets, useTicket
├── pages/                    # All page components
├── services/api.js           # Axios + all API calls
└── styles/index.css          # Global dark theme
```
