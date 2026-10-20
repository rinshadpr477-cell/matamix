# TaskFlow — Enterprise MERN Task Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.x-yellow.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A high-performance, full-stack Task Management application built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB with Mongoose**. Engineered with enterprise-grade UI/UX design tokens, atomic state synchronization, comprehensive security controls, and 100% automated test coverage.

---

## 📑 Table of Contents

1. [Key Features & Highlights](#-key-features--highlights)
2. [Design System & Color Tokens](#-design-system--color-tokens)
3. [Multi-Page Navigation Architecture](#-multi-page-navigation-architecture)
4. [Architecture & Engineering Decisions](#-architecture--key-engineering-decisions)
5. [Project Structure](#-project-structure)
6. [Prerequisites & Environment Configuration](#-prerequisites--environment-configuration)
7. [Installation & Getting Started](#-installation--getting-started)
8. [API Specification & Contract](#-api-specification--contract)
9. [Automated Testing](#-automated-testing)
10. [Production Build & Deployment](#-production-build--deployment)
11. [Security, Performance & Reliability Controls](#-security-performance--reliability-controls)
12. [Visual Preview](#-visual-preview)

---

## ✨ Key Features & Highlights

- **Enterprise Multi-Page Architecture**: Dedicated views for Dashboard, Task Operations, Historical Audit & Export, Infrastructure Health, and System Settings.
- **Atomic Database Operations**: Race-condition-free MongoDB toggles and atomic bulk deletion pipelines.
- **Defensive Input Validation**: Strict Zod schemas validating request payloads, queries, and MongoDB ObjectIds.
- **Formula Injection Mitigation (CWE-1236)**: Automated field sanitization on CSV data exports to protect spreadsheet users.
- **Full-Text Server-Side Search & Filters**: Bounded regex-escaped queries across the full task database collection.
- **Live Infrastructure Diagnostics**: Deep health probes measuring Express status, Mongoose connection `readyState`, uptime, and roundtrip HTTP latency.
- **Zero Mocking In Production**: Real MongoDB integration paired with an isolated in-memory test suite (`mongodb-memory-server`).

---

## 🎨 Design System & Color Tokens

TaskFlow implements a modern, high-contrast professional design system:

| Layout Region | Styling & Color Specification | Description |
| :--- | :--- | :--- |
| **Fixed Sidebar** | `bg-slate-900 text-slate-300 w-64` | Persistent navigation with active pills (`#004e9f`), task count badges, and real-time MongoDB status. |
| **Main Canvas** | `bg-[#f9f9ff] text-slate-900` | Clean light canvas with structured vertical hierarchy. |
| **Cards & Panels** | `bg-white border border-slate-200/80 rounded-2xl shadow-sm` | Sophisticated white cards with subtle border treatments. |
| **Primary Color** | `#004e9f` | Primary buttons, active tabs, progress bars, and focus rings. |
| **Success Color** | `#34A853` | Completion checkmarks, operational health badges, and confirmed state indicators. |
| **Typography** | Plus Jakarta Sans / Inter | Clean font weights, balanced line heights, and restrained letter spacing. |

---

## 🧭 Multi-Page Navigation Architecture

Rather than an overcrowded single view, TaskFlow organizes user workflows into 5 focused pages:

1. **Dashboard (`DashboardView`)**: High-level productivity metrics (**Total Tasks**, **In Progress**, **Completed**, and **Completion Rate %** with animated progress indicator), quick creation form, and recent tasks feed.
2. **Task Board (`App` / Tasks)**: Main operational workflow with instant task creation, search bar, filter tabs (`All`, `Active`, `Completed`), and accessible toggle/delete actions.
3. **History & Export (`HistoryView`)**: Searchable audit log of historical tasks with instant client-side data export to both **RFC-4180 CSV** (with injection defense) and structured **JSON**.
4. **System Health & API (`SystemHealthView`)**: Interactive diagnostic panel probing the backend `/health` endpoint with real-time uptime, ping latency measurement, and registered REST endpoint specifications.
5. **Settings & Maintenance (`SettingsView`)**: Display density controls (Compact Mode), environment inspection, JSON backup downloads, and one-click atomic purge of completed tasks.

---

## 🏛 Architecture & Key Engineering Decisions

- **Layered Backend Architecture**:
  - `Routes`: Map HTTP methods, attach strict validation middleware, and apply rate limiting.
  - `Validators`: Zod schemas parse and bound input constraints (e.g. 1–200 character titles, valid 24-character hexadecimal ObjectIds).
  - `Controllers`: Manage HTTP status codes and responses.
  - `Services`: Domain logic, query bounds (`limit: 100`, `max: 200`), atomic operations, and DTO formatting.
  - `Models`: Mongoose schema with optimized indexes on `{ createdAt: -1 }` and `{ completed: 1 }`.
  - `Centralized Error Handler`: Maps known Mongoose `CastError`, `ValidationError`, and JSON parsing errors into clean client responses while concealing internal stacks in production.

- **Component-Driven State Management**:
  - Custom `useTasks` hook manages tasks, active IDs, per-item pending loaders, and error propagation.
  - Native Fetch wrapper (`apiClient`) with a 10-second `AbortController` timeout and unified error handling.
  - UI updates commit upon verified HTTP responses to guarantee client-database consistency.

---

## 📂 Project Structure

```
matamix/
├── package.json              # Monorepo scripts (concurrent dev, test, build, typecheck)
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
│   │   │   └── task.model.ts # Mongoose Task model with compound indexes
│   │   ├── validators/
│   │   │   └── task.validator.ts # Zod schemas for query, param, and body
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Centralized error & 404 handler
│   │   │   ├── validateRequest.ts # Schema validation middleware
│   │   │   └── rateLimiter.ts    # Express rate limiters
│   │   ├── services/
│   │   │   └── task.service.ts   # Domain logic, filters, & DTO transforms
│   │   ├── controllers/
│   │   │   └── task.controller.ts # Route handler functions
│   │   ├── routes/
│   │   │   ├── task.routes.ts    # /api/tasks REST endpoints
│   │   │   └── health.routes.ts  # /health status probe
│   │   ├── types/
│   │   │   └── task.types.ts     # Interfaces and API response contracts
│   │   ├── app.ts            # Express application factory & middleware setup
│   │   └── server.ts         # Server bootstrap & graceful shutdown handler
│   └── tests/
│       ├── setup.ts          # MongoMemoryServer in-memory DB setup
│       └── task.api.test.ts  # Supertest integration tests (26 passing tests)
│
└── client/                   # Frontend React & Vite application
    ├── .env.example          # Client environment template
    ├── tsconfig.json         # Strict TypeScript configuration
    ├── vite.config.ts        # Vite + Vitest config with proxy (/api & /health)
    ├── tailwind.config.js    # Tailwind styling tokens
    ├── index.html            # Main HTML with font imports and metadata
    ├── package.json
    ├── src/
    │   ├── types/
    │   │   └── task.ts       # Frontend TypeScript definitions
    │   ├── services/
    │   │   ├── apiClient.ts  # Fetch API wrapper with timeout & error normalization
    │   │   └── taskService.ts # REST API service methods & query builders
    │   ├── hooks/
    │   │   └── useTasks.ts   # Custom hook for task state, mutations, & bulk purge
    │   ├── components/
    │   │   ├── Sidebar.tsx   # Fixed dark navigation sidebar with status badge
    │   │   ├── TopHeader.tsx # Sticky top header with breadcrumbs and refresh
    │   │   ├── DashboardView.tsx # Overview metric cards & quick task entry
    │   │   ├── HistoryView.tsx   # Searchable audit table with CSV & JSON exports
    │   │   ├── SystemHealthView.tsx # Live Express and MongoDB probe panel
    │   │   ├── SettingsView.tsx  # Display options & atomic bulk purge
    │   │   ├── StatsBar.tsx  # 4-card metric summary grid
    │   │   ├── TaskForm.tsx  # Input form with character limit counter
    │   │   ├── TaskFilters.tsx # Segmented filter pills with live counts
    │   │   ├── TaskItem.tsx  # Task row with #34A853 checkmark and actions
    │   │   ├── TaskList.tsx  # List renderer
    │   │   ├── EmptyState.tsx # Clean empty state illustration
    │   │   ├── LoadingSpinner.tsx # Skeleton placeholder animations
    │   │   └── ErrorMessage.tsx # Accessible error banner with retry button
    │   ├── App.tsx           # Multi-page view routing and main canvas layout
    │   ├── main.tsx          # React DOM entrypoint
    │   └── index.css         # Design system tokens and custom utilities
    └── tests/
        ├── setup.ts          # Jest-DOM matchers setup
        ├── TaskForm.test.tsx # Form unit tests
        ├── TaskItem.test.tsx # Item interaction unit tests
        └── App.test.tsx      # Full React component integration tests
```

---

## ⚙️ Prerequisites & Environment Configuration

### Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: A running local instance (`mongodb://127.0.0.1:27017/taskflow`) OR a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud connection string.

### Environment Setup

#### 1. Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
MUTATION_RATE_LIMIT_MAX_REQUESTS=100
TRUST_PROXY=1
```

#### 2. Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```env
VITE_API_BASE_URL=/api
```

---

## 🚀 Installation & Getting Started

### 1. Install Dependencies
Install all packages across the root, backend, and frontend:
```bash
# Workspace root
npm install

# Backend packages
npm --prefix server install

# Frontend packages
npm --prefix client install
```

### 2. Run in Development Mode
Start both backend API (`:5000`) and frontend Vite server (`:5173`) concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **System Health Probe**: `http://localhost:5000/health`

---

## 🔌 API Specification & Contract

All API responses adhere to a consistent JSON envelope:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: unknown;
}
```

### Endpoints

| Method | Endpoint | Description | Validation / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System readiness & MongoDB status probe | Returns `status`, `uptime`, and `database.readyState` (200 / 503) |
| `GET` | `/api/tasks` | Fetch tasks with sorting, search, & pagination | `?limit=100&skip=0&search=keyword&completed=true` |
| `POST` | `/api/tasks` | Create a new task | Body: `{ "title": string }` (1–200 characters, trimmed) |
| `PATCH` | `/api/tasks/:id` | Atomic toggle or explicit completion update | Params: `id` (24-hex ObjectId). Optional body: `{ "completed": boolean }` |
| `DELETE` | `/api/tasks/:id` | Permanently delete a task by ID | Params: `id` (24-hex ObjectId) |
| `DELETE` | `/api/tasks/completed` | Atomically purge all completed tasks | Single atomic database operation |

---

## 🧪 Automated Testing

The workspace includes a test suite covering unit, component, API, and integration workflows with **41 passing automated tests**.

```bash
# Run all tests across the monorepo:
npm test

# Run backend API integration tests only (uses in-memory MongoDB):
npm run test:server

# Run frontend React & Vitest component tests:
npm run test:client

# Run full TypeScript typecheck:
npm run typecheck
```

---

## 🔨 Production Build & Deployment

### Build Command
Compile TypeScript for the server and build optimized frontend production bundles:
```bash
npm run build
```
- Server builds into: `server/dist/`
- Client builds into: `client/dist/`

### Deployment Options

1. **Deploying on Vercel + MongoDB Atlas**:
   - The React frontend deploys natively on Vercel.
   - For backend Express API on Vercel, connect via Vercel Serverless Functions (`api/index.ts`) or `vercel.json` rewrites.
   - Database: Use a free [MongoDB Atlas M0 Sandbox](https://www.mongodb.com/atlas) with `0.0.0.0/0` network access enabled.
2. **Deploying on Split Hosting (Recommended for Express)**:
   - Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
   - Backend: [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io)
   - Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🛡 Security, Performance & Reliability Controls

1. **CWE-1236 Defense**: CSV export fields are sanitized against formula injection macros (`=`, `+`, `-`, `@`).
2. **Helmet Security Headers**: Blocks MIME sniffing, clickjacking, and injects secure Content Security Policy standards.
3. **CORS Whitelisting**: Strict origin checking based on `CORS_ORIGIN`, supporting multi-domain and wildcard configurations.
4. **Body Size Quotas**: Request payloads are capped at `100kb` to protect against payload memory exhaustion attacks.
5. **Rate Limiting**: IP-based rate limiting on all API routes (`apiLimiter`) with strict thresholds on state-mutating actions (`mutationLimiter`).
6. **Graceful Shutdown**: Intercepts `SIGINT` and `SIGTERM` with an `isShuttingDown` idempotency lock to drain connections and safely close MongoDB sockets.
7. **No Optimistic State Desync**: UI updates require an HTTP 200/201 response before mutating local state, preventing ghost tasks or inconsistent UI states.

---

## 📸 Visual Preview

<img width="1897" height="1002" alt="image" src="https://github.com/user-attachments/assets/8fee38cb-7814-4ec5-9f27-2ce6998eb38e" />

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
