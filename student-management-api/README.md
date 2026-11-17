# Student Management REST API

A REST API built with **Node.js** and **Express.js** to manage student records using CRUD operations (Create, Read, Update, Delete).
Data is stored in an in-memory JavaScript array (no database), as required by the assignment.

> **Web Dev III (Node.js & Express Backend)** — Unit 2, Lab Assignment 2

---

## Features

- Express.js server setup
- Full CRUD APIs for student records
- Custom logger middleware (logs method, URL, status code and response time)
- Modular routing using `express.Router()`
- Input validation with clear error messages
- Proper HTTP status codes (`200`, `201`, `400`, `404`)
- Global error handling (invalid JSON, unknown routes)
- Postman collection included for testing

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework for building the REST API |
| Nodemon | Auto-restarts the server during development |
| Postman | API testing |

**Restrictions followed:** No MongoDB / MySQL, no Mongoose — array and JSON data only.

---

## Project Structure

```
student-management-api/
├── data/
│   └── students.js           # In-memory array of student records
├── middleware/
│   └── logger.js             # Custom request logger middleware
├── routes/
│   └── studentRoutes.js      # All /students CRUD routes
├── app.js                    # Express server setup, middleware, error handling
├── postman_collection.json   # Postman collection with all API tests
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Postman](https://www.postman.com/downloads/) (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/student-management-api.git

# Go into the project folder
cd student-management-api

# Install dependencies
npm install
```

### Run the Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# OR normal mode
npm start
```

The server starts at: **http://localhost:3000**

---

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Success Code |
|---|---|---|---|
| GET | `/students` | Get all students | 200 |
| GET | `/students/:id` | Get a single student by ID | 200 |
| POST | `/students` | Create a new student | 201 |
| PUT | `/students/:id` | Update an existing student | 200 |
| DELETE | `/students/:id` | Delete a student | 200 |

### Student Object

```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "age": 20,
  "course": "BCA"
}
```

---

## Request & Response Examples

### 1. Get All Students

**Request:** `GET /students`

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "name": "Aarav Sharma", "email": "aarav@example.com", "age": 20, "course": "BCA" },
    { "id": 2, "name": "Priya Verma", "email": "priya@example.com", "age": 21, "course": "B.Tech CSE" },
    { "id": 3, "name": "Rohan Gupta", "email": "rohan@example.com", "age": 19, "course": "BBA" }
  ]
}
```

### 2. Get Student by ID

**Request:** `GET /students/2`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": { "id": 2, "name": "Priya Verma", "email": "priya@example.com", "age": 21, "course": "B.Tech CSE" }
}
```

**Not found:** `GET /students/99` → `404 Not Found`
```json
{ "success": false, "message": "Student with id 99 not found" }
```

### 3. Create Student

**Request:** `POST /students`
```json
{
  "name": "Neha Singh",
  "email": "neha@example.com",
  "age": 22,
  "course": "MCA"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": { "id": 4, "name": "Neha Singh", "email": "neha@example.com", "age": 22, "course": "MCA" }
}
```

**Invalid data:** `POST /students` with `{ "name": "" }` → `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "name is required and must be a non-empty string",
    "email is required and must be a valid email",
    "age is required and must be a positive integer",
    "course is required and must be a non-empty string"
  ]
}
```

### 4. Update Student

**Request:** `PUT /students/4` (send only the fields you want to change)
```json
{
  "age": 23,
  "course": "M.Tech"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": { "id": 4, "name": "Neha Singh", "email": "neha@example.com", "age": 23, "course": "M.Tech" }
}
```

### 5. Delete Student

**Request:** `DELETE /students/4`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": { "id": 4, "name": "Neha Singh", "email": "neha@example.com", "age": 23, "course": "M.Tech" }
}
```

---

## Validation Rules

| Field | Rule |
|---|---|
| `name` | Required, non-empty string |
| `email` | Required, valid email format, must be unique |
| `age` | Required, positive integer |
| `course` | Required, non-empty string |

- **POST** requires all four fields.
- **PUT** accepts any one or more of the fields (partial update).
- `id` is generated automatically and cannot be set by the client.

---

## Error Handling & Status Codes

| Status Code | Meaning | When it is returned |
|---|---|---|
| `200 OK` | Success | GET, PUT, DELETE succeed |
| `201 Created` | Resource created | POST succeeds |
| `400 Bad Request` | Invalid input | Missing/invalid fields, invalid ID (e.g. `/students/abc`), duplicate email, empty PUT body, malformed JSON |
| `404 Not Found` | Resource not found | Student ID does not exist, or the route does not exist |

---

## Middleware

### Custom Logger (`middleware/logger.js`)

Logs every request to the console after the response is sent:

```
[2026-11-17T14:30:12.345Z] GET /students -> 200 (3 ms)
[2026-11-17T14:30:15.678Z] POST /students -> 201 (1 ms)
[2026-11-17T14:30:18.901Z] GET /students/99 -> 404 (0 ms)
```

### Built-in Middleware

- `express.json()` — parses incoming JSON request bodies.

---

## Testing with Postman

1. Start the server with `npm run dev`.
2. Open Postman → **Import** → select `postman_collection.json` from this repository.
3. Run the requests in this order:

| # | Request | Expected |
|---|---|---|
| 1 | Get All Students | 200 |
| 2 | Get Student By ID | 200 |
| 3 | Get Student Not Found | 404 |
| 4 | Create Student | 201 |
| 5 | Create Student Invalid | 400 |
| 6 | Update Student | 200 |
| 7 | Update Student Not Found | 404 |
| 8 | Delete Student | 200 |
| 9 | Delete Student Not Found | 404 |

> **Note:** Data is stored in memory, so it resets to the 3 default students every time the server restarts. Run **Create Student** before **Update Student** and **Delete Student**.

---

## Author

**siddhi**
Web Dev III — Node.js & Express Backend