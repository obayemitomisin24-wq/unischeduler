# CHAPTER THREE: METHODOLOGY

## 3.1 Introduction

This chapter describes the research methodology and system development approach adopted for the UniScheduler project. It covers the software development lifecycle model, requirements engineering process, system architecture design, database schema, neural network design, constraint system, and user-interface design methodology.

---

## 3.2 Research Design

This project follows an **applied research** paradigm: the primary goal is the design and construction of a working system that solves a real problem, with evaluation conducted through functional testing and user acceptance testing rather than controlled experiments with human subjects.

The development methodology is **Iterative and Incremental Development**, a variant of the agile family of processes suited to projects where requirements are reasonably well-understood at the outset but where detailed design decisions benefit from prototyping and feedback. Each iteration delivered a working increment of the system: first the data model and mock data layer, then authentication and routing, then individual dashboard components, and finally the change-request workflow and documentation.

---

## 3.3 Requirements Engineering

### 3.3.1 Functional Requirements

**Authentication Module**

| ID | Requirement |
|----|-------------|
| FR-01 | The system shall present a login screen requiring an email address and password. |
| FR-02 | The system shall authenticate users against stored credentials and assign them a role (admin, lecturer, or student). |
| FR-03 | The system shall redirect authenticated users to the dashboard appropriate to their role. |
| FR-04 | The system shall provide a logout function accessible from all pages. |

**Admin Module**

| ID | Requirement |
|----|-------------|
| FR-05 | Administrators shall be able to view a dashboard showing system statistics and recent activity. |
| FR-06 | Administrators shall be able to add, edit, and delete courses, including code, title, department, year, semester, credits, and assigned lecturer. |
| FR-07 | Administrators shall be able to add, edit, and delete lecturer records. |
| FR-08 | Administrators shall be able to add, edit, and delete room records including capacity and type. |
| FR-09 | Administrators shall be able to add timeslots specifying day, start time, end time, and period number. |
| FR-10 | Administrators shall be able to view the complete university timetable. |
| FR-11 | Administrators shall be able to trigger MLP model training and observe training metrics in real time. |
| FR-12 | Administrators shall be able to view all timetable change requests, filter by status, and approve or reject each request with an optional response message. |

**Lecturer Module**

| ID | Requirement |
|----|-------------|
| FR-13 | Lecturers shall be able to view a personalised dashboard showing their teaching load, today's classes, and change-request history. |
| FR-14 | Lecturers shall be able to view the courses assigned to them. |
| FR-15 | Lecturers shall be able to view their personal weekly teaching schedule. |
| FR-16 | Lecturers shall be able to submit a timetable change request specifying the class to reschedule, preferred day and time, and a reason. |

**Student Module**

| ID | Requirement |
|----|-------------|
| FR-17 | Students shall be able to view a personalised dashboard showing their department's courses, today's classes, and recent schedule changes. |
| FR-18 | Students shall be able to view the full departmental timetable. |
| FR-19 | Students shall be able to submit a timetable change request. |
| FR-20 | Students shall be able to view the status of their submitted change requests. |

### 3.3.2 Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | Pages shall load within 2 seconds on a standard broadband connection. | Performance |
| NFR-02 | The interface shall be fully usable on screen widths from 375px (mobile) to 1920px (desktop). | Usability |
| NFR-03 | Role-based access control shall prevent users from accessing pages or data outside their role. | Security |
| NFR-04 | The system shall provide meaningful feedback for all user actions within 100ms. | Responsiveness |
| NFR-05 | All form inputs shall be validated client-side before submission. | Data Integrity |
| NFR-06 | The codebase shall be written in TypeScript with strict mode enabled. | Maintainability |

---

## 3.4 System Architecture

### 3.4.1 Overall Architecture

The system follows a **Single-Page Application (SPA)** architecture. The React application handles all routing client-side, and communication with the backend data store occurs asynchronously through the Supabase client library. The production architecture consists of:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite + TypeScript + Tailwind CSS)         │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌───────────┐  │  │
│  │  │ Auth Layer  │  │  Role Router   │  │ MLP Engine│  │  │
│  │  └─────────────┘  └────────────────┘  └───────────┘  │  │
│  │                                                       │  │
│  │  ┌───────────┐  ┌────────────┐  ┌───────────────┐    │  │
│  │  │  Admin    │  │  Lecturer  │  │   Student     │    │  │
│  │  │ Dashboard │  │  Dashboard │  │   Dashboard   │    │  │
│  │  └───────────┘  └────────────┘  └───────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST
┌──────────────────────────▼──────────────────────────────────┐
│                   SUPABASE (Backend-as-a-Service)           │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  PostgreSQL DB   │  │  Row-Level Security Policies     │ │
│  │  (8 tables)      │  │  (per-role data access)          │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  Auth Service    │  │  Auto-generated REST API         │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.4.2 Component Architecture

The React component hierarchy is designed around the principle of **separation of concerns by role**:

```
App (root)
├── Login
└── Layout (sidebar + header shell)
    ├── Admin views
    │   ├── AdminDashboard
    │   ├── CourseManagement
    │   ├── ResourceManagement (Lecturers / Rooms / Timeslots)
    │   ├── ModelTraining
    │   └── ChangeRequestManagement
    ├── Lecturer views
    │   └── LecturerDashboard
    └── Student views
        └── StudentDashboard
    ── Shared views
        ├── TimetableViewer
        └── RequestChange
```

The `Layout` component provides the sidebar navigation, top bar, and notification badge. The `App` component handles authentication state and page routing, rendering the appropriate component tree based on the authenticated user's role.

---

## 3.5 Database Design

### 3.5.1 Entity-Relationship Model

The data model consists of eight entities:

- **faculties**: Top-level organisational units (e.g., Faculty of Science).
- **departments**: Academic departments within faculties.
- **courses**: Individual taught courses with code, title, credits, year, and semester.
- **lecturers**: Academic staff with department affiliation.
- **rooms**: Physical spaces with capacity and type.
- **timeslots**: Day-period combinations available for scheduling.
- **timetable**: The central scheduling table, linking courses, lecturers, rooms, and timeslots.
- **change_requests**: Records of reschedule requests with status and audit trail.

### 3.5.2 Relational Schema

```sql
-- Faculties
CREATE TABLE faculties (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id  UUID REFERENCES faculties(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  semester     INTEGER NOT NULL CHECK (semester IN (1, 2)),
  year         INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
  credits      INTEGER NOT NULL DEFAULT 3,
  department   TEXT NOT NULL,
  lecturer_id  UUID REFERENCES lecturers(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Lecturers
CREATE TABLE lecturers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  department   TEXT NOT NULL,
  title        TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Rooms
CREATE TABLE rooms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  capacity   INTEGER NOT NULL,
  type       TEXT NOT NULL,
  building   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Timeslots
CREATE TABLE timeslots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day         TEXT NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  period      INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Timetable entries
CREATE TABLE timetable (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  lecturer_id  UUID REFERENCES lecturers(id),
  room_id      UUID REFERENCES rooms(id),
  timeslot_id  UUID REFERENCES timeslots(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (room_id, timeslot_id),
  UNIQUE (lecturer_id, timeslot_id)
);

-- Change requests
CREATE TABLE change_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id    TEXT NOT NULL,
  requester_name  TEXT NOT NULL,
  requester_role  TEXT NOT NULL,
  timetable_id    UUID REFERENCES timetable(id),
  course_name     TEXT NOT NULL,
  current_day     TEXT NOT NULL,
  current_time    TEXT NOT NULL,
  requested_day   TEXT NOT NULL,
  requested_time  TEXT NOT NULL,
  reason          TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 3.5.3 Indexing Strategy

Indexes are created on all foreign-key columns and on the `status` column of `change_requests` (used frequently for filtering) to ensure sub-100ms query response times for expected dataset sizes.

---

## 3.6 Neural Network Design

### 3.6.1 Architecture Selection

A **Multilayer Perceptron** was selected over more complex architectures (CNN, RNN, GNN) for the following reasons:

1. **Feature space**: The input features (day preference, time preference, room capacity, course duration, department encoding) are tabular, not spatial or sequential — the domain in which MLPs excel.
2. **Interpretability**: The MLP's weight matrices can be inspected to understand which features most influence timeslot predictions.
3. **Deployability**: The MLP can be implemented in pure TypeScript and executed in the browser without WebAssembly or a server-side Python process.
4. **Training speed**: On a CPU with simulated data, the MLP trains in seconds, enabling live training demonstrations within the web interface.

### 3.6.2 Network Topology

```
Input Layer    (5 neurons)
     ↓
Hidden Layer 1 (256 neurons, ReLU activation)
     ↓
Hidden Layer 2 (128 neurons, ReLU activation)
     ↓
Hidden Layer 3 (64 neurons, ReLU activation)
     ↓
Output Layer   (45 neurons, Softmax activation)
```

**Input features** (5 dimensions):
1. Day of week (encoded: Mon=0, Tue=0.25, Wed=0.5, Thu=0.75, Fri=1.0)
2. Normalised time of day (0 = 08:00, 1 = 18:00)
3. Normalised room capacity (capacity / maximum capacity)
4. Normalised course duration (hours / 4)
5. Department one-hot encoding (collapsed to single normalised integer)

**Output**: A probability distribution over 45 possible timeslot assignments (9 timeslots × 5 days), from which the highest-probability feasible assignment is selected.

### 3.6.3 Training Algorithm

- **Loss function**: Categorical cross-entropy — appropriate for multi-class classification.
- **Optimiser**: Mini-batch stochastic gradient descent with configurable learning rate (default 0.001) and batch size (default 32).
- **Activation**: ReLU for hidden layers (avoids vanishing gradient); Softmax for output layer (produces interpretable probability distribution).
- **Epochs**: Configurable from 10 to 200 (default 50).

### 3.6.4 Constraint-Repair Mechanism

After the MLP produces a ranked list of timeslot probabilities for each course, the constraint validator checks the top-ranked assignment:

```
For each course c in scheduling order:
  predictions ← MLP.predict(features(c))  // ranked list of timeslots
  For each timeslot t in predictions (highest probability first):
    If not room_conflict(t) AND
       not lecturer_conflict(t) AND
       room_capacity(t) >= enrolled_students(c):
      assign(c, t)
      break
    Else:
      continue to next predicted timeslot
  If no valid assignment found:
    flag c as unscheduled and alert administrator
```

This greedy repair guarantees that all hard constraints are satisfied in the final timetable, at the cost of occasionally deviating from the MLP's top prediction.

---

## 3.7 User Interface Design Methodology

### 3.7.1 Design Principles

The UI design follows five principles derived from Nielsen's usability heuristics:

1. **Role clarity**: Each dashboard immediately communicates the user's role through colour (Admin: indigo/red, Lecturer: purple, Student: green) and personalised greeting.
2. **Information hierarchy**: The most time-sensitive information (today's classes, pending actions) appears at the top of each dashboard.
3. **Minimal clicks**: Critical actions (add course, respond to request) are reachable within two clicks from the respective dashboard.
4. **Consistent feedback**: All form submissions show loading states, success confirmations, or error messages.
5. **Responsive layout**: The sidebar collapses on narrow viewports; cards reflow from multi-column to single-column grid below 768px.

### 3.7.2 Colour System

| Role | Primary Gradient | Accent | Badge |
|------|-----------------|--------|-------|
| Admin | indigo-900 → blue-900 | red-500 | bg-red-100 text-red-700 |
| Lecturer | purple-600 → indigo-600 | purple-500 | bg-purple-100 text-purple-700 |
| Student | green-600 → emerald-600 | green-500 | bg-green-100 text-green-700 |

### 3.7.3 Prototyping Process

The design followed a three-stage process: (1) paper wireframes for layout and information architecture, (2) high-fidelity mockups in Tailwind CSS applied directly in the React development environment, and (3) iterative refinement based on functional testing. This approach — sometimes called "CSS-first prototyping" — is well-suited to solo or small-team development projects.

---

## 3.8 Testing Strategy

### 3.8.1 Unit Testing

Core algorithmic components (MLP forward pass, constraint validator, data mutation helpers) were tested independently using manual test cases with known expected outputs.

### 3.8.2 Integration Testing

Each page component was tested end-to-end: logging in with each role, navigating to each page accessible to that role, performing all CRUD operations, and verifying that mock data was correctly updated and displayed.

### 3.8.3 User Acceptance Testing

A structured walkthrough was conducted with three representative users (one per role), each completing a task list derived from the functional requirements. Acceptance criteria: all tasks completed without requiring external assistance.

---

## 3.9 Summary

This chapter has described the iterative development methodology, functional and non-functional requirements, system and database architecture, MLP network design, constraint-repair algorithm, and UI design methodology. Chapter Four presents the implementation details that translate these designs into working code.
