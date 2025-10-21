# 🚀 Quick Setup Guide

Follow these steps to get the Task Manager application running on your machine.

## Step 1: Install Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB**
   - **Option A - Local Installation:**
     - Windows: https://www.mongodb.com/try/download/community
     - Mac: `brew install mongodb-community`
     - Linux: Follow official MongoDB docs
   
   - **Option B - MongoDB Atlas (Cloud):**
     - Create free account: https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string

3. **Git** (to clone the project)
   - Download from: https://git-scm.com/

## Step 2: Install Dependencies

### Backend Setup

Open terminal/command prompt:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- nodemon (dev dependency)

### Frontend Setup

Open a new terminal/command prompt:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite
- @vitejs/plugin-react

## Step 3: Configure Environment Variables

### Backend Configuration

The `.env` file in the `backend` directory is already created. Update it if needed:

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
```

**If using MongoDB Atlas:**
Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### Frontend Configuration (Optional)

By default, the frontend uses proxy configuration. No .env needed unless you want to change the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Start MongoDB (if local)

If you installed MongoDB locally, start it:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or manually start:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

## Step 5: Run the Application

### Start Backend Server

Open terminal in `backend` folder:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### Start Frontend Development Server

Open a new terminal in `frontend` folder:

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 6: Open the Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 7: Test the Application

1. **Click "Sign up"** to create an account
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"
4. You'll be redirected to the Dashboard
5. Create your first task!

## 🎉 You're All Set!

The application is now running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: MongoDB (local or Atlas)

## Common Commands

### Backend
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Ensure MongoDB is running (if local)
- Check MONGODB_URI in backend/.env
- If using Atlas, check:
  - IP whitelist includes your IP
  - Username/password are correct
  - Database user has read/write permissions

### Issue: "Port 5000 already in use"

**Solution:**
Change PORT in backend/.env to another port (e.g., 5001)

### Issue: "Port 3000 already in use"

**Solution:**
Change port in frontend/vite.config.js:
```js
server: {
  port: 3001, // Change to different port
  // ...
}
```

### Issue: Frontend can't connect to backend

**Solution:**
- Ensure backend is running on port 5000
- Check proxy configuration in frontend/vite.config.js
- Clear browser cache and restart dev server

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Make sure MongoDB is running
5. Check that ports 3000 and 5000 are available

---

**Enjoy building with the Task Manager! 🎯**

