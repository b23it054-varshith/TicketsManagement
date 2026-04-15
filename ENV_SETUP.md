# Environment Setup Guide

## Prerequisites
- Node.js 16+ 
- MongoDB (local or Atlas)
- npm or yarn

## Backend Setup

### 1. Create `.env` file in `/server` directory

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ticket-system
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket-system

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here_min_32_chars
JWT_REFRESH_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Create uploads directory
```bash
mkdir -p uploads/attachments
```

### 4. Seed Demo Admin (Optional)
```bash
npm run seed:admin
```
This creates:
- **Admin**: admin@demo.com / password123
- **Agent**: agent@demo.com / password123
- **User**: user@demo.com / password123

### 5. Start Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

## Frontend Setup

### 1. Create `.env` file in `/client` directory

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Environment Variables Explained

### Backend Variables
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret key for signing access tokens
- `JWT_EXPIRE`: Access token expiration time
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `JWT_REFRESH_EXPIRE`: Refresh token expiration time
- `PORT`: Server port
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL (for CORS)

### Frontend Variables
- `VITE_API_URL`: Backend API base URL

## Database Initialization

### Using MongoDB Local
1. Start MongoDB service:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. Create database (optional - MongoDB auto-creates):
```bash
mongosh
use ticket-system
```

### Using MongoDB Atlas
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add your IP to whitelist
4. Update `MONGODB_URI` in `.env`

## Verification

### Check Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check Frontend
Open `http://localhost:5173` in browser
Log in with demo credentials

## Common Issues

### "Cannot find module" errors
**Solution**: Run `npm install` in both `/server` and `/client`

### Connection refused on MongoDB
**Solution**: 
- Check if MongoDB is running
- Verify `MONGODB_URI` is correct
- Check firewall settings

### CORS errors
**Solution**: 
- Verify `CLIENT_URL` in backend `.env`
- Ensure frontend is running on the specified port
- Check that API calls use correct base URL

### Port already in use
**Solution**: 
- Change PORT in `.env`
- Or kill process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

## Production Deployment

### Frontend (Vite)
```bash
npm run build
# Creates /dist folder for deployment
```

### Backend (Node.js)
```bash
# Set environment
set NODE_ENV=production  # Windows
export NODE_ENV=production  # macOS/Linux

npm start
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, Railway, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB

## Security Checklist

- [ ] Change all JWT secrets to strong random values
- [ ] Use HTTPS in production
- [ ] Set secure cookies (httpOnly, secure flags)
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for trusted domains
- [ ] Keep dependencies updated

## Helpful Commands

### Backend Development
```bash
# Watch mode with nodemon
npm run dev

# Start server normally
npm start

# Seed admin user
npm run seed:admin
```

### Frontend Development
```bash
# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

### Database
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/ticket-system"

# View all databases
show databases

# Use specific database
use ticket-system

# View collections
show collections

# View documents in collection
db.users.find()
```

---

**Version**: 2.0
**Last Updated**: April 2026
