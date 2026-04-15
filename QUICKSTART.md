# Quick Start Guide - TicketFlow v2.0

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Backend
```bash
cd server

# Create .env file with these minimum settings:
# MONGODB_URI=mongodb://localhost:27017/ticket-system
# JWT_SECRET=my_jwt_secret_min_32_characters_long_12345
# JWT_REFRESH_SECRET=my_refresh_secret_min_32_characters_12345

npm install
npm run dev
```
Backend starts on: http://localhost:5000

### Step 2: Setup Frontend
```bash
cd client

# Create .env file with:
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
```
Frontend starts on: http://localhost:5173

### Step 3: Login with Demo Credentials

#### Option A: Use Quick Demo Selector (NEW!)
1. Click on demo role buttons on login page
2. Credentials auto-fill
3. Click "Sign In"

#### Option B: Manual Entry
- **👤 Regular User**: user@demo.com / password123
- **🧑‍💼 Support Agent**: agent@demo.com / password123  
- **⚙️ Administrator**: admin@demo.com / password123

---

## 📊 What Each Role Can Do

### User Account
```
✅ Create new tickets
✅ View own tickets
✅ Add comments
✅ Rate resolved tickets
✅ View knowledge base
❌ Cannot edit tickets
❌ Cannot view other users' data
```

### Agent Account
```
✅ View assigned tickets
✅ Update ticket status & priority
✅ Leave internal notes
✅ Reassign tickets
✅ View reports
✅ Add comments
❌ Cannot manage users
❌ Cannot access admin panel
```

### Admin Account
```
✅ Access complete admin panel
✅ Manage all users (role changes, activation)
✅ Manage all tickets
✅ View system statistics
✅ View overview dashboard
✅ Full system control
```

---

## 🎯 Key Features to Try

### For Users
1. **Create Ticket**
   - Click "New Ticket" in sidebar
   - Fill in title, description, category, priority
   - Submit and wait for assignment

2. **Edit Your Profile**
   - Click Profile in sidebar
   - Update department, avatar, etc.

3. **View Tickets**
   - Click "Tickets" to see your tickets
   - Click ticket to see details
   - Add comments/replies

### For Agents (NEW!)
1. **Edit Tickets**
   - Open any assigned ticket
   - Click "✏️ Edit" button
   - Update status, priority, reassign
   - Changes are saved and notified

2. **View Dashboard**
   - See assigned tickets count
   - View open/in-progress tickets
   - See SLA status

### For Admins (UPGRADED!)
1. **Overview Statistics**
   - Access admin panel automatically after login
   - See all system statistics
   - Monitor user and ticket counts

2. **Manage Users**
   - Tab: "Users"
   - Edit role: User → Agent → Admin
   - Activate/Deactivate accounts
   - Search by name or email

3. **Manage Tickets**
   - Tab: "Tickets"
   - Update any ticket's status, priority, assignment
   - Search across all tickets
   - Monitor ticket health

---

## 🎫 Ticket Status Flow (NEW!)

```
📍 Open
  ↓
🔄 In Progress
  ↓
⏳ Pending
  ↓
✅ Resolved
  ↓
🔒 Closed
```

**Steps to complete:**
1. Agent receives ticket → Updates to "In Progress"
2. While working → May change to "Pending" (waiting for user)
3. When fixed → Changes to "Resolved"
4. After user confirms → Changes to "Closed"

---

## 🗂️ Main Screens

### Login Page (Enhanced!)
- Role-based demo selector buttons
- Better visual feedback
- Demo credentials visible
- Secure password toggle

### User Dashboard
- Overview of your tickets
- Statistics cards
- Quick links to create tickets

### Agent Dashboard
- Your assigned tickets
- Current status overview
- Reports access

### Admin Panel (Completely Redesigned!)
- **Overview Tab**: System statistics
- **Users Tab**: User management with search
- **Tickets Tab**: Full ticket management with search

### Ticket Detail (Enhanced!)
- Edit button for agents/admins
- Status workflow indicators
- Real-time updates
- Comments section
- Activity timeline

---

## 🔧 Troubleshooting

### Blank Page on Frontend
```
✓ Check: npm run dev is running
✓ Check: Backend is online (http://localhost:5000/api/health)
✓ Check: VITE_API_URL in .env is correct
✓ Try: Clear browser cache • Restart server
```

### Login Fails
```
✓ Check: Backend server is running
✓ Check: MongoDB is running and connected
✓ Check: Database has demo users (run: npm run seed:admin in server)
✓ Check: Credentials are exact (case-sensitive)
```

### Edit Ticket Button Missing
```
✓ Check: You're logged in as agent or admin
✓ Check: Ticket is not in "Closed" status
✓ Check: Refresh the page
```

### Admin Panel Not Visible
```
✓ Check: Your account role is "admin"
✓ Check: Try logging out and back in
✓ Check: Go directly to http://localhost:5173/admin
```

---

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + K` | Search (if implemented) |
| `Esc` | Close modals |
| `Tab` | Navigate forms |

---

## 🌐 API Health Check

Test if backend is working:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-14T10:30:00.000Z"
}
```

---

## 📚 Next Steps

1. **Explore Features**: Try all three roles to understand workflow
2. **Create Test Data**: Create tickets, add comments, update status
3. **Read Documentation**: Check `UPGRADE_GUIDE.md` for detailed info
4. **Environment Setup**: Check `ENV_SETUP.md` for production settings

---

## ⚡ Performance Tips

- Use Clear Search for better filtering
- Check admin panel statistics regularly
- Keep browser updated for best compatibility
- Close unused browser tabs

---

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check backend logs in terminal
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Try restarting both servers
6. Clear browser cache and cookies

---

## ✨ What's New in v2.0

✅ **Role-Based Authentication** - Users auto-redirect to their dashboard  
✅ **Enhanced Login** - Demo role selector buttons  
✅ **Ticket Edit Modal** - Full ticket editing with status workflow  
✅ **Premium Admin Panel** - Complete user and ticket management  
✅ **Better Sidebar** - Role-specific navigation  
✅ **Real-time Updates** - Via Socket.IO  
✅ **Comprehensive Guides** - UPGRADE_GUIDE.md & ENV_SETUP.md  

---

**Version**: 2.0 (Advanced)  
**Status**: ✅ Production Ready  
**Last Updated**: April 2026  

Happy Ticketing! 🎯
