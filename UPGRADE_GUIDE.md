# TicketFlow - MERN Project Upgrade Guide

## 🎯 Features Implemented

### 1. **Role-Based Authentication & Routing**
- **User Roles**: User, Agent, Admin
- **Automatic Redirection**: Users are redirected to appropriate dashboards based on their role
  - Admins → `/admin` (Admin Panel)
  - Agents → `/dashboard` (Agent Dashboard)
  - Users → `/dashboard` (User Dashboard)
- **Protected Routes**: Routes are properly protected with role-based middleware

### 2. **Enhanced Login Page**
- **Demo Role Selection**: Quick access buttons to fill demo credentials
- **Three Demo Accounts**:
  - 👤 **User**: user@demo.com / password123
  - 🧑‍💼 **Agent**: agent@demo.com / password123
  - ⚙️ **Admin**: admin@demo.com / password123
- **Improved UI**: Better visual feedback with role indicators

### 3. **Ticket Management Features**

#### 3.1 Ticket Edit Modal (TicketEditModal Component)
- **Full ticket editing capability**:
  - Edit title and description
  - Change category and priority
  - Update ticket status (Open → In Progress → Pending → Resolved → Closed)
  - Re-assign to different agents
  - Visual status flow indicators
- **Access Control**: Only Admin and Agent roles can edit tickets
- **Location**: Accessible from ticket detail page via "Edit" button

#### 3.2 Enhanced Ticket Detail Page
- Added "Edit" button in page header
- Integrated TicketEditModal component
- Quick actions section in sidebar
- Real-time updates via Socket.IO

#### 3.3 Ticket Status Workflow
```
Open → In Progress → Pending → Resolved → Closed
```
- Progressive status updates
- Status validation on backend
- Notifications on status changes

### 4. **Advanced Admin Panel**

#### 4.1 Overview Tab
- **Dashboard Statistics**:
  - Total Users & Active Users
  - Agent count
  - Total & Open Tickets
  - Resolved tickets
  - SLA breached count
  - Visual stat cards with icons

#### 4.2 Users Management Tab
- **User Table** with columns:
  - User name with avatar
  - Email
  - Role (User/Agent/Admin)
  - Department
  - Account status (Active/Inactive)
  - Last login timestamp
  - Edit action button
- **Filtering**: Search by name or email
- **Edit Modal**: Change user role and activation status

#### 4.3 Tickets Management Tab
- **Ticket Table** with columns:
  - Ticket ID
  - Title
  - Requester name
  - Assigned agent
  - Status badge
  - Priority badge
  - Creation date
  - Edit action button
- **Filtering**: Search by ticket ID, title, or description
- **Edit Modal**: Update status, priority, and assignment

### 5. **Ticket Update Workflow**
- **Backend Route**: `PUT /api/tickets/:id`
- **Authorization**:
  - Admin can update any ticket
  - Agent can update assigned tickets
  - Users can view their own tickets
- **Logged Changes**: Activity log tracks all modifications
- **Real-time Notifications**: Socket.IO broadcasts updates to relevant users

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tickets
- `GET /api/tickets` - Get tickets (filtered by role)
- `GET /api/tickets/:id` - Get ticket detail
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket status/priority/assignment
- `POST /api/tickets/:id/comments` - Add comment
- `POST /api/tickets/:id/rating` - Rate ticket

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/agents` - Get all agents
- `GET /api/users/:id` - Get user detail
- `PUT /api/users/:id` - Update user role/status

## 🚀 How to Use

### For Users
1. Login with user credentials
2. View your created tickets on dashboard
3. Create new tickets
4. Leave comments on tickets
5. Rate resolved tickets

### For Agents
1. Login with agent credentials
2. View assigned tickets on dashboard
3. Update ticket status and priority
4. Reassign tickets if needed
5. Leave internal notes and comments
6. View reports (if enabled)

### For Admins
1. Login with admin credentials
2. Access admin panel automatically
3. **Overview Tab**: See system statistics
4. **Users Tab**: Manage user roles and account status
5. **Tickets Tab**: Manage all tickets in the system

## 🔧 Backend Middleware

### Authentication Middleware (`/server/middleware/auth.js`)
```javascript
- protect: Validates JWT token and attaches user to request
- authorize(...roles): Checks if user has required role
```

### Usage in Routes
```javascript
// Protect route (authentication required)
router.get('/protected', protect, (req, res) => { ... });

// Protect + Authorize (specific roles required)
router.put('/admin-only', protect, authorize('admin'), (req, res) => { ... });
```

## 📁 File Structure

### Frontend Components
```
client/src/
├── pages/
│   ├── Login.jsx (Enhanced with role selection)
│   ├── TicketDetail.jsx (Updated with edit modal)
│   ├── AdminPanel.jsx (Completely redesigned)
│   └── ...
├── components/
│   └── tickets/
│       └── TicketEditModal.jsx (NEW)
└── context/
    └── AuthContext.jsx (Updated with role-based routing)
```

### Backend Routes
```
server/routes/
├── auth.js (Login, Register, Token refresh)
├── tickets.js (Ticket CRUD with status updates)
├── users.js (User management)
└── ...
```

## ✅ Testing Checklist

- [ ] User login works correctly
- [ ] Agent login redirects to dashboard
- [ ] Admin login redirects to admin panel
- [ ] Demo role buttons populate credentials
- [ ] Ticket edit modal opens from detail page
- [ ] Status updates are saved
- [ ] Agent reassignment works
- [ ] Admin can view and edit all users
- [ ] Admin can view and manage all tickets
- [ ] Notifications appear on ticket updates
- [ ] Real-time updates work via Socket.IO

## 🔐 Security Notes

1. **JWT Tokens**: Uses secure JWT with refresh tokens
2. **Password**: Hashed with bcrypt (6+ characters required)
3. **Authorization**: Role-based access control on all sensitive routes
4. **Account Deactivation**: Inactive users cannot login
5. **Activity Logging**: All ticket changes are tracked

## 🐛 Common Issues & Solutions

### Issue: Users seeing 403 errors when updating tickets
**Solution**: Ensure user role is 'admin' or 'agent', or they are the ticket creator

### Issue: Edit modal not appearing
**Solution**: Verify TicketEditModal component is imported in TicketDetail.jsx

### Issue: Admin panel shows no data
**Solution**: Check network tab for API errors, ensure admin has correct role

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Verify user role and permissions
3. Check backend logs for API errors
4. Ensure JWT token is valid (not expired)

---

**Version**: 2.0 (Advanced)
**Last Updated**: April 2026
**Status**: Production Ready
