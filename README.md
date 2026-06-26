# UniScheduler — MLP-Based University Timetable Management System

A production-quality web application combining a deep neural network with role-differentiated dashboards for university timetable scheduling.

---

## Features

### 🔐 Authentication
- Secure login screen with email & password
- Role detection (Admin / Lecturer / Student)
- Quick-login demo buttons for testing

### 👤 Role-Based Dashboards

| Role | Dashboard Features |
|------|--------------------|
| **Admin** | System stats, course/lecturer/room/timeslot CRUD, MLP training, change request management |
| **Lecturer** | Today's classes, personal schedule, my courses, request timetable change |
| **Student** | Today's classes, department timetable, recent updates, request timetable change |

### 📚 Course Management
- Add, edit, delete courses with full metadata
- Assign lecturers directly from course form
- Search and filter by code, title, or department

### 📅 Timetable Viewer
- Colour-coded weekly grid (Mon–Fri)
- Role-filtered: lecturers see own classes; students see department timetable
- Export button (UI ready; connect to backend for file generation)

### 🔄 Timetable Change Requests
- Lecturers/students submit reschedule requests with reason
- Admins review, filter (all/pending/approved/rejected), and respond
- Real-time notification badge for pending requests

### 🧠 MLP Neural Network
- Architecture: Input(5) → Dense(256) → Dense(128) → Dense(64) → Output(45)
- Configurable: epochs, batch size, learning rate
- Live training progress bar and accuracy chart
- Constraint-repair ensures zero hard-constraint violations

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Lecturer | n.adeyemi@university.edu | lecturer123 |
| Student | a.okonkwo@student.university.edu | student123 |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:5173
```

---

## Production Build

```bash
npm run build   # Outputs to dist/
npm run preview # Preview production build
```

**Build output**: ~63 KB gzipped JS, ~6 KB gzipped CSS

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database (prod) | Supabase (PostgreSQL) |
| Neural Network | Custom TypeScript MLP |

---

## Project Structure

```
src/
├── types/index.ts           ← Shared TypeScript interfaces
├── lib/
│   ├── mockData.ts          ← In-memory data store
│   ├── mlp.ts               ← Neural network
│   └── supabase.ts          ← Database client
├── components/
│   ├── Login.tsx
│   ├── admin/               ← Admin-only components
│   ├── lecturer/            ← Lecturer-only components
│   ├── student/             ← Student-only components
│   └── shared/              ← Multi-role components
└── App.tsx                  ← Auth state + role routing

docs/
├── Chapter1_Introduction.md
├── Chapter2_LiteratureReview.md
├── Chapter3_Methodology.md
├── Chapter4_Implementation.md
└── Chapter5_ConclusionRecommendations.md
```

---

## Connecting to Supabase (Production)

1. Create a Supabase project at https://supabase.com
2. Run the migration: `supabase/migrations/*.sql`
3. Update `.env`:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Replace mock data calls in components with Supabase queries

---

## Documentation

Full academic report (Chapters 1–5) is in the `docs/` folder covering:
- Chapter 1: Introduction & problem statement
- Chapter 2: Literature review
- Chapter 3: Methodology & system design
- Chapter 4: Implementation details
- Chapter 5: Evaluation, limitations & recommendations

---

**Version**: 2.0.0 | **Academic Year**: 2025/2026
