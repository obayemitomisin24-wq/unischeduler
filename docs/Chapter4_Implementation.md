# CHAPTER FOUR: SYSTEM IMPLEMENTATION

## 4.1 Introduction

This chapter presents the technical implementation of the UniScheduler system. It covers the technology stack selection, project structure, authentication system, role-based routing, key component implementations, the MLP neural network module, the constraint-validation layer, and the timetable change-request workflow.

---

## 4.2 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| UI Framework | React | 18.3.1 | Component-based; huge ecosystem; concurrent rendering |
| Language | TypeScript | 5.5.3 | Static typing prevents class of runtime errors |
| Build Tool | Vite | 5.4.2 | Sub-second HMR; fast cold starts |
| Styling | Tailwind CSS | 3.4.1 | Utility-first; minimal CSS bundle; rapid iteration |
| Icons | Lucide React | 0.344.0 | Consistent, tree-shakeable SVG icon set |
| Database | Supabase (PostgreSQL) | 2.57.4 | Managed Postgres; RLS; real-time; auth |
| Neural Network | Custom TypeScript MLP | — | No external dependency; browser-native |

The decision to implement the MLP in TypeScript (rather than using TensorFlow.js or ONNX Runtime Web) was driven by the desire to keep the dependency footprint small and the training logic fully auditable within the project codebase.

---

## 4.3 Project Structure

```
timetable-system/
├── src/
│   ├── types/
│   │   └── index.ts                    ← Shared TypeScript interfaces
│   ├── lib/
│   │   ├── mockData.ts                 ← In-memory data store + mutation helpers
│   │   ├── mlp.ts                      ← MLP neural network implementation
│   │   └── supabase.ts                 ← Supabase client (production)
│   ├── components/
│   │   ├── Login.tsx                   ← Authentication screen
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx      ← Admin overview and stats
│   │   │   ├── CourseManagement.tsx    ← Full CRUD for courses
│   │   │   ├── ResourceManagement.tsx  ← CRUD for lecturers/rooms/timeslots
│   │   │   ├── ModelTraining.tsx       ← MLP training UI
│   │   │   └── ChangeRequestManagement.tsx ← Review and respond to requests
│   │   ├── lecturer/
│   │   │   └── LecturerDashboard.tsx  ← Personalised lecturer view
│   │   ├── student/
│   │   │   └── StudentDashboard.tsx   ← Personalised student view
│   │   └── shared/
│   │       ├── Layout.tsx             ← Sidebar + topbar shell
│   │       ├── TimetableViewer.tsx    ← Grid timetable (all roles)
│   │       └── RequestChange.tsx      ← Change-request form (lecturer + student)
│   ├── App.tsx                         ← Root: auth state + role routing
│   ├── main.tsx                        ← React DOM render entry
│   └── index.css                       ← Tailwind directives
├── docs/                               ← Project documentation (Chapters 1–5)
├── supabase/migrations/                ← SQL schema migrations
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.app.json
```

---

## 4.4 Type System

All shared data structures are defined in `src/types/index.ts`, ensuring consistency across components:

```typescript
export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  lecturerId?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: number;
  year: number;
  credits: number;
  department: string;
  lecturer_id?: string;
}

export interface ChangeRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_role: UserRole;
  timetable_id: string;
  course_name: string;
  current_day: string;
  current_time: string;
  requested_day: string;
  requested_time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_response?: string;
}
```

The `UserRole` union type ensures that any component that handles role-based logic will receive a type error at compile time if an unrecognised role value is used.

---

## 4.5 Authentication Implementation

### 4.5.1 Login Component

The `Login.tsx` component renders a full-screen landing page with three interaction elements:

1. **Email/password form**: Validates credentials against the `USER_CREDENTIALS` lookup table and calls `onLogin(user)` on success.
2. **Quick-login buttons**: Populate the form fields with demo credentials for each role, enabling rapid testing.
3. **Error display**: Shows a styled error card on authentication failure.

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  // Simulate network latency for realism
  await new Promise(r => setTimeout(r, 800));

  const expectedPassword = USER_CREDENTIALS[email.toLowerCase()];
  const user = MOCK_USERS.find(u =>
    u.email.toLowerCase() === email.toLowerCase()
  );

  if (user && expectedPassword === password) {
    onLogin(user);
  } else {
    setError('Invalid email or password. Please try again.');
  }
  setLoading(false);
};
```

In the production deployment, this handler is replaced by a Supabase Auth call:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

### 4.5.2 Auth State in App.tsx

The `App` component holds authentication state as a single `User | null` value:

```typescript
const [user, setUser] = useState<User | null>(null);
```

When `user` is `null`, only the `Login` component renders. When `user` is set, the `Layout` shell renders with the appropriate dashboard for the user's role. This pattern ensures that unauthenticated users cannot reach any protected page, even by manipulating the browser URL.

---

## 4.6 Role-Based Routing

The `App` component's `renderPage` function implements role-based page routing:

```typescript
const renderPage = () => {
  if (user.role === 'admin') {
    switch (currentPage) {
      case 'dashboard':        return <AdminDashboard />;
      case 'courses':          return <CourseManagement />;
      case 'lecturers':        return <ResourceManagement type="lecturers" />;
      case 'rooms':            return <ResourceManagement type="rooms" />;
      case 'timeslots':        return <ResourceManagement type="timeslots" />;
      case 'timetable':        return <TimetableViewer user={user} />;
      case 'training':         return <ModelTraining />;
      case 'change-requests':  return <ChangeRequestManagement />;
    }
  }
  if (user.role === 'lecturer') { /* lecturer pages */ }
  if (user.role === 'student')  { /* student pages */ }
};
```

The `Layout` component's sidebar only renders navigation items whose `roles` array includes the current user's role:

```typescript
const visibleItems = NAV_ITEMS.filter(item =>
  item.roles.includes(user.role)
);
```

These two mechanisms together ensure complete role isolation: a student who somehow navigates to `/courses` receives the Student Dashboard (the default case), not the Course Management admin panel.

---

## 4.7 Course Management Implementation

The `CourseManagement` component provides full Create, Read, Update, Delete functionality for courses. Key implementation details:

### 4.7.1 State Management

Local component state is used rather than a global state manager, keeping the component self-contained:

```typescript
const [courses, setCourses] = useState<Course[]>(() => [...MOCK_COURSES]);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
const [form, setForm] = useState<FormState>(EMPTY_FORM);
```

The `editingId` field distinguishes between "add new" and "edit existing" modes, enabling the same modal form to serve both purposes.

### 4.7.2 Modal Form

The form renders as a fixed-position overlay with a blurred backdrop, preventing interaction with the table beneath while editing:

```tsx
{showForm && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
                  flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      {/* Form contents */}
    </div>
  </div>
)}
```

### 4.7.3 Inline Delete Confirmation

To prevent accidental deletion, the delete button transitions to a two-button confirmation pair (confirm / cancel) on first click, without a separate modal:

```tsx
{deleteConfirm === course.id ? (
  <div className="flex items-center gap-1">
    <button onClick={() => handleDelete(course.id)}>✓</button>
    <button onClick={() => setDeleteConfirm(null)}>✗</button>
  </div>
) : (
  <button onClick={() => setDeleteConfirm(course.id)}>🗑</button>
)}
```

### 4.7.4 Search and Filter

A controlled text input filters the displayed rows client-side on every keystroke, providing instant feedback:

```typescript
const filtered = courses.filter(c =>
  c.code.toLowerCase().includes(search.toLowerCase()) ||
  c.title.toLowerCase().includes(search.toLowerCase()) ||
  c.department.toLowerCase().includes(search.toLowerCase())
);
```

---

## 4.8 Timetable Viewer Implementation

The `TimetableViewer` component renders a colour-coded weekly grid:

- **Rows**: Unique time periods (08:00–10:00, 10:00–12:00, etc.)
- **Columns**: Days of the week (Monday–Friday)
- **Cells**: Zero or more timetable entry cards, colour-coded by course

The colour assignment is computed from a palette using the course's array index modulo the palette length, ensuring distinct colours for all courses:

```typescript
const courseColorMap = new Map<string, string>();
entries.forEach((e, i) => {
  if (!courseColorMap.has(e.course_id)) {
    courseColorMap.set(e.course_id, COLOR_PALETTE[i % COLOR_PALETTE.length]);
  }
});
```

**Role-specific filtering**: The timetable shown to a lecturer is filtered to entries where `lecturer_id` matches the authenticated user's ID. Students see all entries for their department's courses.

---

## 4.9 Change Request Workflow Implementation

### 4.9.1 Request Submission (RequestChange.tsx)

The `RequestChange` component allows lecturers and students to submit reschedule requests. The form:

1. Lists only the timetable entries relevant to the user (lecturer's own classes, or all classes for students).
2. When a class is selected, shows the current schedule in a highlighted panel for reference.
3. Captures preferred day, preferred time, and a free-text reason.
4. On submission, calls `addChangeRequest()` from the mock data layer, which appends the request to the in-memory store.

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  addChangeRequest({
    requester_id: user.id,
    requester_name: user.name,
    requester_role: user.role,
    timetable_id: form.timetable_id,
    course_name: `${selectedEntry.course?.code} - ${selectedEntry.course?.title}`,
    current_day: selectedEntry.slot?.day || '',
    current_time: `${selectedEntry.slot?.start_time} - ${selectedEntry.slot?.end_time}`,
    requested_day: form.requested_day,
    requested_time: form.requested_time,
    reason: form.reason,
    status: 'pending',
  });
  setSubmitted(true);
};
```

### 4.9.2 Request Review (ChangeRequestManagement.tsx)

The admin's change request panel provides:

- **Filter tabs**: All / Pending / Approved / Rejected with live counts.
- **Request cards**: Each shows course name, requester, current and requested schedules, reason, and (if resolved) the admin response.
- **Inline response form**: Clicking "Respond to Request" expands a textarea and Approve/Reject buttons within the card, avoiding navigation away from the list.
- **Notification badge**: The Layout's sidebar and top bar show a red badge with the count of pending requests, drawing admin attention.

```typescript
const handleApprove = (id: string) => {
  updateChangeRequest(id, {
    status: 'approved',
    admin_response: response || 'Request approved.'
  });
  setResponding(null);
  setResponse('');
  refresh();
};
```

---

## 4.10 MLP Neural Network Implementation

The MLP is implemented in `src/lib/mlp.ts` as a pure TypeScript class:

```typescript
class MLP {
  private layers: number[][];   // activations
  private weights: number[][][]; // weight matrices
  private biases: number[][];    // bias vectors

  constructor(topology: number[]) {
    // Xavier initialisation of weights
    this.weights = topology.slice(0, -1).map((size, i) => {
      const next = topology[i + 1];
      return Array.from({ length: size }, () =>
        Array.from({ length: next }, () =>
          (Math.random() * 2 - 1) * Math.sqrt(2 / size)
        )
      );
    });
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private softmax(v: number[]): number[] {
    const max = Math.max(...v);
    const exps = v.map(x => Math.exp(x - max)); // numerically stable
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }

  forward(input: number[]): number[] {
    let activation = input;
    this.weights.forEach((W, l) => {
      const z = W[0].map((_, j) =>
        activation.reduce((sum, a, i) => sum + a * W[i][j], this.biases[l][j])
      );
      activation = l < this.weights.length - 1
        ? z.map(this.relu)
        : this.softmax(z);
    });
    return activation; // probability distribution over timeslots
  }

  train(X: number[][], y: number[][], epochs: number,
        lr: number, batchSize: number,
        onProgress: (e: number, loss: number, acc: number) => void): void {
    // Mini-batch SGD with backpropagation
    for (let epoch = 1; epoch <= epochs; epoch++) {
      // ... (backpropagation implementation)
      onProgress(epoch, currentLoss, currentAccuracy);
    }
  }
}
```

**Xavier initialisation** (`sqrt(2 / fan_in)`) is used rather than uniform random initialisation to prevent vanishing or exploding gradients during the early training epochs.

The **numerically stable softmax** subtracts the maximum activation before exponentiation, preventing floating-point overflow for large logits.

---

## 4.11 Model Training UI Implementation

The `ModelTraining` component simulates the training loop using `setInterval` inside a `useEffect`, updating progress and metrics in real time:

```typescript
useEffect(() => {
  if (!training) return;
  let epoch = 0;
  const interval = setInterval(() => {
    epoch++;
    // Simulate realistic loss curve: exponential decay + noise
    const loss = Math.max(0.05,
      2.3 * Math.exp(-epoch / (epochs * 0.3))
      + (Math.random() - 0.5) * 0.05
    );
    const accuracy = Math.min(97,
      50 + (epoch / epochs) * 47
      + (Math.random() - 0.5) * 2
    );
    setCurrentMetric({ epoch, loss, accuracy });
    setProgress(Math.round((epoch / epochs) * 100));
    if (epoch >= epochs) {
      clearInterval(interval);
      setTraining(false);
      setDone(true);
    }
  }, 80);
  return () => clearInterval(interval); // cleanup on unmount
}, [training, epochs]);
```

The 80ms interval provides a visually engaging training simulation — fast enough to see progress without being unpleasantly slow. The cleanup function ensures the interval is cancelled if the component unmounts during training.

---

## 4.12 Notification System

Pending change requests are surfaced to the admin through two mechanisms:

1. **Sidebar badge**: The "Change Requests" nav item shows a red circular badge with the pending count.
2. **Top-bar bell icon**: A bell icon with the same count appears in the header, with a click handler that navigates directly to the Change Requests page.

Both are driven by the `pendingRequests` prop passed from `App.tsx`:

```typescript
const pendingRequests = MOCK_CHANGE_REQUESTS.filter(
  r => r.status === 'pending'
).length;
```

---

## 4.13 Responsive Design

The layout uses Tailwind's responsive prefix system:

- **Sidebar**: Hidden on screens below `md` (768px); a hamburger menu would be added in a full mobile implementation.
- **Stat card grids**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — stacked on mobile, two columns on tablet, four on desktop.
- **Table overflow**: Wrapped in `overflow-x-auto` containers so tables scroll horizontally on narrow screens rather than breaking the layout.
- **Timetable grid**: Minimum column width of 160px per day enforces readability; horizontal scrolling is available for narrow viewports.

---

## 4.14 Summary

This chapter has detailed the implementation of all major system components: authentication, role-based routing, course management CRUD, timetable viewing, change-request workflow, MLP neural network, training UI, notification system, and responsive design. Chapter Five evaluates the system against its stated objectives and provides recommendations for future development.
