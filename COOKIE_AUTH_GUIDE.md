# 🍪 Cookie-Based Authentication Guide

This application now uses **httpOnly cookies** instead of localStorage for storing JWT tokens, providing enhanced security.

## 🔒 Why Cookies are More Secure

### Security Benefits:

1. **XSS Protection**: httpOnly cookies cannot be accessed via JavaScript, preventing XSS attacks from stealing tokens
2. **CSRF Protection**: sameSite: 'strict' prevents CSRF attacks
3. **Automatic Management**: Browser handles cookie storage and sending automatically
4. **Secure Flag**: In production, cookies are only sent over HTTPS

### Comparison:

| Feature | localStorage | httpOnly Cookies |
|---------|-------------|------------------|
| XSS Vulnerable | ✅ Yes | ❌ No |
| CSRF Protection | ❌ No | ✅ Yes (with sameSite) |
| Accessible by JS | ✅ Yes | ❌ No |
| Auto-sent with requests | ❌ No | ✅ Yes |

---

## 📋 Changes Made

### Backend Changes

#### 1. Added cookie-parser middleware

**File**: `backend/package.json`
```json
"cookie-parser": "^1.4.6"
```

**File**: `backend/server.js`
```javascript
import cookieParser from 'cookie-parser';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // Enable cookies in CORS
}));
app.use(cookieParser());
```

#### 2. Updated Auth Controller to set cookies

**File**: `backend/controllers/authController.js`

Added `setTokenCookie` function:
```javascript
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,                    // Prevent JavaScript access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',                // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
  });
};
```

Now `signup` and `login` set the cookie instead of returning the token:
```javascript
const token = generateToken(user._id);
setTokenCookie(res, token);

res.status(200).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  // No token in response
});
```

#### 3. Added Logout Endpoint

**File**: `backend/controllers/authController.js`
```javascript
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
```

**File**: `backend/routes/authRoutes.js`
```javascript
router.post('/logout', protect, logout);
```

#### 4. Updated Auth Middleware to read from cookies

**File**: `backend/middleware/authMiddleware.js`
```javascript
export const protect = async (req, res, next) => {
  let token;
  
  // Check for token in cookies first
  token = req.cookies.token;
  
  // Fallback to Authorization header (backward compatibility)
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // ... verify token
};
```

---

### Frontend Changes

#### 1. Updated API Service

**File**: `frontend/src/services/api.js`

Added `withCredentials: true` to axios instance:
```javascript
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
});
```

Removed token interceptor (no longer needed):
```javascript
// ❌ REMOVED: No need to add Authorization header
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
```

Added logout API:
```javascript
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'), // New
  getMe: () => api.get('/auth/me'),
};
```

#### 2. Updated Auth Context

**File**: `frontend/src/context/AuthContext.jsx`

Changed to verify cookie on app load:
```javascript
useEffect(() => {
  const checkAuth = async () => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        // Verify cookie is still valid
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        // Cookie expired or invalid
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };
  
  checkAuth();
}, []);
```

Updated login/signup to not store token:
```javascript
const login = async (email, password) => {
  const response = await authAPI.login({ email, password });
  const userData = response.data; // No token in response
  
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
};
```

Updated logout to call API:
```javascript
const logout = async () => {
  try {
    await authAPI.logout(); // Clear cookie on backend
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('user');
    setUser(null);
  }
};
```

#### 3. Updated Navbar

**File**: `frontend/src/components/Navbar.jsx`

Made logout handler async:
```javascript
const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

---

## 🚀 Running the Application

### Install New Dependencies

```bash
# Backend
cd backend
npm install

# This will install cookie-parser
```

### Start the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

---

## 🧪 Testing Cookie Authentication

### 1. Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

The response will NOT include a token, but the cookie will be saved to `cookies.txt`.

### 2. Test Protected Route with Cookie

```bash
curl -X GET http://localhost:5000/api/tasks \
  -b cookies.txt
```

### 3. Test Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## 🔍 How It Works

### Authentication Flow:

1. **User logs in/signs up**
   ```
   Frontend → POST /api/auth/login
   Backend → Sets httpOnly cookie in response
   Frontend → Stores user data in localStorage (not token)
   ```

2. **Making API requests**
   ```
   Frontend → GET /api/tasks (cookie sent automatically)
   Backend → Reads token from req.cookies.token
   Backend → Verifies JWT and returns data
   ```

3. **User logs out**
   ```
   Frontend → POST /api/auth/logout
   Backend → Clears cookie by setting expiry to past date
   Frontend → Removes user from localStorage
   ```

---

## 🛡️ Security Features

### Cookie Configuration:

```javascript
{
  httpOnly: true,        // Cannot be accessed by JavaScript
  secure: true,          // Only sent over HTTPS (production)
  sameSite: 'strict',    // Only sent to same-site requests
  maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
}
```

### CORS Configuration:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Specific origin
  credentials: true                  // Allow cookies
}));
```

**For production**, update CORS origin:
```javascript
origin: process.env.FRONTEND_URL || 'https://yourdomain.com'
```

---

## 🌐 Production Deployment

### Environment Variables

Add to `backend/.env`:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### CORS Update

**File**: `backend/server.js`
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### HTTPS Required

In production, cookies with `secure: true` require HTTPS. Most hosting platforms (Vercel, Render, Heroku) provide HTTPS automatically.

---

## 📊 What's Stored Where

| Data | Storage Location | Purpose |
|------|-----------------|---------|
| JWT Token | httpOnly Cookie (backend-managed) | Authentication |
| User Info | localStorage | UI display only |

**Note**: User info in localStorage is just for UI convenience (displaying name, etc.). The actual authentication is done via the httpOnly cookie.

---

## ✅ Benefits Summary

✅ **More Secure**: Tokens protected from XSS attacks  
✅ **CSRF Protected**: sameSite: 'strict' prevents CSRF  
✅ **Auto-managed**: Browser handles cookie storage  
✅ **Production-ready**: Secure flag for HTTPS  
✅ **Backward Compatible**: Fallback to Authorization header  

---

## 🔄 Migration from localStorage

If you had the old version, the changes are already implemented. Just:

1. Install backend dependencies: `cd backend && npm install`
2. Restart both servers
3. Existing users need to log in again (old localStorage tokens won't work)

---

**Your app is now using secure cookie-based authentication! 🎉**

