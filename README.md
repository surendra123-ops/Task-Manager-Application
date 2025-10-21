# 📝 Task Manager Application

A full-stack task management web application built with React, Node.js, Express, and MongoDB. Features include user authentication, CRUD operations for tasks, filtering, and a modern responsive UI.

## ✨ Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter by status (completed/incomplete) and priority (low/medium/high)
- **Search**: Search tasks by title or description
- **Priority Levels**: Assign priority levels to tasks (Low, Medium, High)
- **Deadlines**: Set deadlines and get overdue notifications
- **Responsive UI**: Modern, clean interface built with Tailwind CSS
- **Real-time Stats**: Track total, completed, and incomplete tasks

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
adihaonefullstackrole/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── taskRoutes.js      # Task endpoints
│   ├── server.js              # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskList.jsx
    │   │   ├── TaskItem.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js         # Axios config
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd adihaonefullstackrole
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory if you need a custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start MongoDB (if running locally)

```bash
mongod
```

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint          | Description        | Auth Required |
|--------|-------------------|--------------------|---------------|
| POST   | `/api/auth/signup`| Register new user  | No            |
| POST   | `/api/auth/login` | Login user         | No            |
| GET    | `/api/auth/me`    | Get current user   | Yes           |

### Tasks

| Method | Endpoint           | Description        | Auth Required |
|--------|--------------------|--------------------|---------------|
| GET    | `/api/tasks`       | Get all user tasks | Yes           |
| GET    | `/api/tasks/:id`   | Get single task    | Yes           |
| POST   | `/api/tasks`       | Create new task    | Yes           |
| PUT    | `/api/tasks/:id`   | Update task        | Yes           |
| DELETE | `/api/tasks/:id`   | Delete task        | Yes           |

### Query Parameters

- `GET /api/tasks?status=completed` - Filter by status
- `GET /api/tasks?priority=high` - Filter by priority

## 🎯 Usage Examples

### Signup

```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task

```json
POST /api/tasks
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "deadline": "2024-12-31"
}
```

### Update Task

```json
PUT /api/tasks/:id
Headers: { "Authorization": "Bearer <token>" }
{
  "status": "completed"
}
```

## 🎨 Features in Detail

### Task Priority System
- **Low**: Green badge
- **Medium**: Yellow badge (default)
- **High**: Red badge

### Task Status
- **Incomplete**: Default state
- **Completed**: Marked with checkbox, shown with strikethrough

### Overdue Detection
Tasks with deadlines in the past are highlighted with:
- Red left border
- "Overdue" label in red

### Search & Filter
- Search by title or description
- Filter by status (All/Incomplete/Completed)
- Filter by priority (All/Low/Medium/High)

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected routes with middleware
- Token stored in localStorage
- Automatic logout on 401 errors

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend (Render/Heroku)

1. Set environment variables in hosting platform
2. Update MongoDB URI to production database
3. Deploy from Git repository

## 🧪 Testing the Application

1. **Signup**: Create a new account
2. **Login**: Login with your credentials
3. **Create Tasks**: Add several tasks with different priorities
4. **Mark Complete**: Click checkboxes to mark tasks complete
5. **Edit Task**: Click edit button to modify a task
6. **Delete Task**: Click delete button to remove a task
7. **Filter**: Try different filters and search queries
8. **Logout**: Click logout and verify token is cleared

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network access if using MongoDB Atlas

### CORS Errors
- Backend includes CORS middleware
- Check proxy settings in vite.config.js

### Port Already in Use
- Change PORT in backend/.env
- Change port in frontend/vite.config.js

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a full-stack learning project demonstrating modern web development practices.

---

**Happy Task Managing! 🎉**

