# Ticket Management System

A full-stack web application built with the **MERN Stack** (MongoDB, Express, React, Node.js) that allows users to raise support tickets, agents to resolve them, and admins to manage everything.

## Features

- **User Registration & Login** — JWT-based authentication
- **Raise Tickets** — Users can create tickets with category and priority
- **Ticket Management** — Agents can update status and reply to tickets
- **Admin Panel** — Manage all users and tickets
- **Knowledge Base** — Self-help articles for common issues
- **Role-based Access** — Three roles: User, Agent, Admin

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Token) |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/       # Login, Register, Dashboard, Tickets, etc.
│       ├── components/  # Reusable UI components
│       ├── context/     # AuthContext (global user state)
│       └── services/    # API calls (axios)
├── server/          # Node.js + Express backend
│   ├── models/      # Mongoose schemas (User, Ticket, Comment)
│   ├── routes/      # API route handlers
│   ├── middleware/  # JWT auth middleware
│   └── server.js   # Entry point
```

## Setup & Run

### 1. Clone the repository
```bash
git clone <repo-url>
cd Miniproject_MERN
```

### 2. Setup Server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
node server.js
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev
```

### 4. Seed Admin User
```bash
cd server
node seedAdmin.js
```
This creates a default admin account:
- **Email:** admin@ticketflow.com
- **Password:** admin123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/tickets | Get all tickets |
| POST | /api/tickets | Create ticket |
| PUT | /api/tickets/:id | Update ticket |
| POST | /api/tickets/:id/comments | Add comment |
| GET | /api/users | Get all users (admin) |
| GET | /api/kb | Get knowledge base articles |

## User Roles

- **User** — Can raise tickets and view their own tickets
- **Agent** — Can view assigned tickets and update status
- **Admin** — Full access to all tickets, users, and the admin panel
