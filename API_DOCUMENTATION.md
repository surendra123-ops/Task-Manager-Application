# 📚 API Documentation

Complete API reference for the Task Manager backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "_id": "64abc123def456789",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

**400 - Missing Fields:**
```json
{
  "message": "Please provide all fields"
}
```

**400 - Password Too Short:**
```json
{
  "message": "Password must be at least 6 characters"
}
```

**400 - User Already Exists:**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login User

Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "_id": "64abc123def456789",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

**400 - Missing Fields:**
```json
{
  "message": "Please provide email and password"
}
```

**401 - Invalid Credentials:**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

Get authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "_id": "64abc123def456789",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**

**401 - No Token:**
```json
{
  "message": "Not authorized, no token"
}
```

**401 - Invalid Token:**
```json
{
  "message": "Not authorized, invalid token"
}
```

---

## ✅ Task Endpoints

All task endpoints require authentication.

### 1. Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint:** `GET /api/tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `status`: Filter by status (`incomplete` or `completed`)
- `priority`: Filter by priority (`low`, `medium`, or `high`)

**Examples:**
```
GET /api/tasks
GET /api/tasks?status=completed
GET /api/tasks?priority=high
GET /api/tasks?status=incomplete&priority=medium
```

**Success Response (200):**
```json
[
  {
    "_id": "64def789abc123456",
    "title": "Complete project documentation",
    "description": "Write README and API docs",
    "status": "incomplete",
    "priority": "high",
    "deadline": "2024-12-31T00:00:00.000Z",
    "user": "64abc123def456789",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "64def789abc123457",
    "title": "Review pull requests",
    "description": "Check and merge pending PRs",
    "status": "completed",
    "priority": "medium",
    "deadline": null,
    "user": "64abc123def456789",
    "createdAt": "2024-01-14T09:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

### 2. Get Single Task

Retrieve a specific task by ID.

**Endpoint:** `GET /api/tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "_id": "64def789abc123456",
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "status": "incomplete",
  "priority": "high",
  "deadline": "2024-12-31T00:00:00.000Z",
  "user": "64abc123def456789",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

**404 - Task Not Found:**
```json
{
  "message": "Task not found"
}
```

**401 - Not Authorized:**
```json
{
  "message": "Not authorized to view this task"
}
```

---

### 3. Create Task

Create a new task.

**Endpoint:** `POST /api/tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "priority": "high",
  "deadline": "2024-12-31"
}
```

**Field Specifications:**
- `title`: Required, string, max 100 characters
- `description`: Optional, string, max 500 characters
- `priority`: Optional, enum [`low`, `medium`, `high`], default: `medium`
- `deadline`: Optional, ISO date string

**Success Response (201):**
```json
{
  "_id": "64def789abc123456",
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "status": "incomplete",
  "priority": "high",
  "deadline": "2024-12-31T00:00:00.000Z",
  "user": "64abc123def456789",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

**400 - Missing Title:**
```json
{
  "message": "Please provide a task title"
}
```

---

### 4. Update Task

Update an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "deadline": "2024-12-25"
}
```

**Success Response (200):**
```json
{
  "_id": "64def789abc123456",
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "deadline": "2024-12-25T00:00:00.000Z",
  "user": "64abc123def456789",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

**Error Responses:**

**404 - Task Not Found:**
```json
{
  "message": "Task not found"
}
```

**401 - Not Authorized:**
```json
{
  "message": "Not authorized to update this task"
}
```

---

### 5. Delete Task

Delete a task permanently.

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "message": "Task deleted successfully",
  "id": "64def789abc123456"
}
```

**Error Responses:**

**404 - Task Not Found:**
```json
{
  "message": "Task not found"
}
```

**401 - Not Authorized:**
```json
{
  "message": "Not authorized to delete this task"
}
```

---

## 🔧 Common Response Codes

| Code | Description |
|------|-------------|
| 200  | Success - Request completed successfully |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input or validation error |
| 401  | Unauthorized - Missing or invalid authentication |
| 404  | Not Found - Resource doesn't exist |
| 500  | Server Error - Internal server error |

---

## 📝 Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min: 6),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  _id: ObjectId,
  title: String (required, max: 100),
  description: String (max: 500),
  status: String (enum: ['incomplete', 'completed'], default: 'incomplete'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  deadline: Date,
  user: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Tokens expire in 30 days
3. **Protected Routes**: All task endpoints require valid JWT
4. **User Isolation**: Users can only access their own tasks
5. **Input Validation**: All inputs are validated and sanitized

---

## 🧪 Testing with curl

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Task","description":"Testing API","priority":"high"}'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status":"completed"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**For testing with a GUI tool, use Postman or Insomnia and import these endpoints!**

