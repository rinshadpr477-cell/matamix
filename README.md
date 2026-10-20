# TaskFlow — Production-Ready MERN Task Manager

A high-performance, full-stack Task Manager built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB with Mongoose**.

---

## 📑 Table of Contents
1. [Architecture & Engineering Decisions](#architecture--key-engineering-decisions)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Environment Setup](#environment-setup)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [API Specification](#api-specification)
8. [Testing](#testing)
9. [Production Build & Deployment](#production-build--deployment)
10. [Security & Robustness Controls](#security--robustness-controls)

---

## 🏛 Architecture & Key Engineering Decisions

TaskFlow is architected with strict separation of concerns, defensive validation, and full-stack type safety:

- **Clean Architecture on Backend**:
  - `Routes` define HTTP endpoints and attach validation middleware & rate limiters.
  - `Validators` (powered by Zod) strictly parse, sanitize, and validate incoming data (e.g. MongoDB ObjectIds, required titles, length bounds) before controllers are reached.
  - `Controllers` handle HTTP request/response orchestration and status codes.
  - `Services` encapsulate domain and business logic, independent of Express semantics.
  - `Models` define Mongoose schemas with indexed fields and toJSON data transformations.
  - `Centralized Error Middleware` intercepts operational errors, schema validation errors, and malformed JSON payloads to return consistent, uniform JSON error structures without leaking stack traces or internal secrets.

- **Component-Driven State Management on Frontend**:
  - `useTasks` custom hook encapsulates data fetching, task creation, toggling, deletion, and granular pending states.
  - Dedicated `apiClient` native Fetch wrapper with request timeouts (10s AbortController), standardized error normalization, and clean error messages.
  - UI mutations are committed only upon verified HTTP 200/201 responses from the API, preventing desynchronized optimistic state.
  - UI features rich empty states, per-item pending spinners, character limits (max 200 chars), filter tabs (All, Active, Completed), keyword search, and immediate retry buttons for failed server requests.

---

## 📂 Project Structure

```
matamix/
├── package.json              # Root orchestration scripts (concurrent dev, test, build)
├── .gitignore                # Global git ignore configuration
├── README.md                 # Complete documentation
│
├── server/                   # Backend Express & MongoDB service
│   ├── .env.example          # Server environment template
│   ├── tsconfig.json         # Strict TypeScript compiler options
│   ├── vitest.config.ts      # Vitest config for API integration tests
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts        # Zod-validated environment config
│   │   │   └── db.ts         # MongoDB connection lifecycle & listeners
│   │   ├── models/
│   │   │   └── task.model.ts # Mongoose Task model with indexes
│   │   ├── validators/
│   │   │   └── task.validator.ts # Zod request schemas
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Centralized error & 404 handler
│   │   │   ├── validateRequest.ts # Schema validation middleware
│   │   │   └── rateLimiter.ts    # Rate limiting for mutations & API
│   │   ├── services/
│   │   │   └── task.service.ts   # Core business logic & DTO mapping
│   │   ├── controllers/
│   │   │   └── task.controller.ts # Route handler functions
│   │   ├── routes/
│   │   │   ├── task.routes.ts    # /api/tasks REST endpoints
│   │   │   └── health.routes.ts  # /health status endpoint
│   │   ├── types/
│   │   │   └── task.types.ts     # Interfaces and API response contracts
│   │   ├── app.ts            # Express application factory
│   │   └── server.ts         # Server bootstrap & graceful shutdown
│   └── tests/
│       ├── setup.ts          # MongoMemoryServer in-memory DB setup
│       └── task.api.test.ts  # Supertest integration tests (17 passed)
│
└── client/                   # Frontend React & Vite application
    ├── .env.example          # Client environment template
    ├── tsconfig.json         # Strict TypeScript configuration
    ├── vite.config.ts        # Vite + Vitest config with proxy
    ├── tailwind.config.js    # Tailwind styling theme
    ├── index.html            # Main HTML with Google Fonts
    ├── package.json
    ├── src/
    │   ├── types/
    │   │   └── task.ts       # Frontend TypeScript definitions
    │   ├── services/
    │   │   ├── apiClient.ts  # Fetch API wrapper with timeout & error handling
    │   │   └── taskService.ts # REST API service methods
    │   ├── hooks/
    │   │   └── useTasks.ts   # Custom hook for task state & mutations
    │   ├── components/
    │   │   ├── Header.tsx    # Header with status indicator
    │   │   ├── StatsBar.tsx  # Total, Pending, Completed metrics
    │   │   ├── TaskForm.tsx  # Creation input with duplicate prevention
    │   │   ├── TaskFilters.tsx # Tabs & search input
    │   │   ├── TaskItem.tsx  # Individual task row with actions
    │   │   ├── TaskList.tsx  # Task list renderer
    │   │   ├── EmptyState.tsx # Empty state message
    │   │   ├── LoadingSpinner.tsx # Loading animation
    │   │   └── ErrorMessage.tsx # Error banner with Retry action
    │   ├── App.tsx           # Main application view
    │   ├── main.tsx          # React DOM render entry
    │   └── index.css         # Styling, glassmorphism, fonts
    └── tests/
        ├── setup.ts          # Jest-DOM matchers setup
        ├── TaskForm.test.tsx # Form unit tests
        ├── TaskItem.test.tsx # Item interaction unit tests
        └── App.test.tsx      # Full React component integration tests
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher (v20.x recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local MongoDB instance (`mongodb://localhost:27017/task_manager`) OR a MongoDB Atlas cluster URI.

*(Note: Automated backend tests run completely in-memory using `mongodb-memory-server` and do NOT require an external database).*

---

## 🔑 Environment Setup

### 1. Backend (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task_manager
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
MUTATION_RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Frontend (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📦 Installation

Install all dependencies across the monorepo from the root:

```bash
# From workspace root:
npm install

# Install server dependencies:
npm --prefix server install

# Install client dependencies:
npm --prefix client install
```

---

## 🚀 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`
- **Health Check**: `http://localhost:5000/health`

### Option B: Run Individually
In separate terminal windows:
```bash
# Terminal 1 - Backend:
cd server
npm run dev

# Terminal 2 - Frontend:
cd client
npm run dev
```

---

## 🔌 API Specification

All endpoints return a standardized JSON response:
`{ "success": boolean, "data"?: any, "message"?: string, "error"?: string }`

### 1. Get All Tasks
- **URL**: `GET /api/tasks`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "67b700f1234567890abcdef1",
      "title": "Review system architecture",
      "completed": false,
      "createdAt": "2026-10-20T13:20:00.000Z",
      "updatedAt": "2026-10-20T13:20:00.000Z"
    }
  ],
  "message": "Tasks retrieved successfully"
}
```

### 2. Create Task
- **URL**: `POST /api/tasks`
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "title": "Implement authentication" }`
- **Rules**:
  - Automatically trims whitespace.
  - Rejects empty, whitespace-only, or missing title with `400 Bad Request`.
  - Rejects title exceeding 200 characters with `400 Bad Request`.
  - Sets `completed: false` by default.
- **Response**: `201 Created`

### 3. Toggle / Update Task Status
- **URL**: `PATCH /api/tasks/:id`
- **Headers**: `Content-Type: application/json`
- **Body**: `{}` (toggles between true/false) OR `{ "completed": true }` (explicit)
- **Rules**:
  - Validates MongoDB 24-character hexadecimal ObjectId (returns `400 Bad Request` if invalid).
  - Returns `404 Not Found` if task does not exist.
- **Response**: `200 OK` with updated task DTO.

### 4. Delete Task
- **URL**: `DELETE /api/tasks/:id`
- **Rules**:
  - Validates MongoDB ObjectId format.
  - Returns `404 Not Found` if task does not exist.
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "67b700f1234567890abcdef1",
    "message": "Task deleted successfully"
  },
  "message": "Task deleted successfully"
}
```

---

## 🧪 Testing

Both backend and frontend have comprehensive automated test suites using **Vitest**, **Supertest**, and **React Testing Library**.

### Run All Tests
```bash
npm test
```

### Run Backend Tests Only
```bash
npm run test:server
```
*(Executes against an isolated in-memory MongoDB instance; completely non-destructive).*

### Run Frontend Tests Only
```bash
npm run test:client
```
*(Executes in jsdom, verifying render states, user event submissions, toggling, deletions, and network retry flows).*

---

## 🔨 Production Build & Deployment

### Build Bundles
```bash
npm run build
```
- Compiles server TypeScript to `server/dist/`.
- Bundles and tree-shakes frontend assets with Vite to `client/dist/`.

### Run Production Server
```bash
cd server
npm start
```

---

## 🛡 Security & Robustness Controls

1. **Helmet Security Headers**: Blocks XSS, clickjacking, MIME sniffing, and embeds CSP guidelines.
2. **Strict CORS Whitelisting**: Allows explicit origins from environment variable (`CORS_ORIGIN`).
3. **Payload Limiting**: Restricts JSON body size to `100kb` to protect against Denial of Service memory exhaustion attacks.
4. **Zod Schema Validation**: Eliminates unexpected fields, validates types, and bounds string lengths.
5. **Rate Limiting**: Express rate limiters protect mutations (`POST`, `PATCH`, `DELETE`) against automated flooding.
6. **Graceful Shutdown**: Catches `SIGINT` and `SIGTERM` to close existing HTTP connections cleanly and disconnect from MongoDB before exit.


   <img width="1897" height="1002" alt="image" src="https://github.com/user-attachments/assets/8fee38cb-7814-4ec5-9f27-2ce6998eb38e" />

