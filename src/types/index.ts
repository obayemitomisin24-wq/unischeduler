export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  studentId?: string;
  lecturerId?: string;
  phone?: string;
  level?: number;        // student year level: 100-500
  semester?: number;     // active semester: 1 | 2
}

export interface Faculty {
  id: string;
  name: string;
  shortCode: string;
  color: FacultyColor;
}

export interface FacultyColor {
  bg: string;
  border: string;
  text: string;
  badge: string;
  header: string;
  dot: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: number;
  year: number;
  credits: number;
  department: string;
  faculty: string;
  lecturer_id?: string;
  enrollment?: number;   // expected student count — used for room capacity check
  courseType?: 'lecture' | 'lab' | 'seminar' | 'studio';
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  faculty: string;
  title: string;
  phone?: string;
  maxHoursPerWeek?: number;   // soft constraint for workload balance
  unavailableSlots?: string[]; // timeslot IDs the lecturer is blocked
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
  facilities?: string[];   // e.g. ['projector','AC','whiteboard']
  available?: boolean;
}

export interface Timeslot {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  period: number;
}

export interface TimetableEntry {
  id: string;
  course_id: string;
  lecturer_id: string;
  room_id: string;
  timeslot_id: string;
  semester: number;
  academicYear: string;
  course?: Course;
  lecturer?: Lecturer;
  room?: Room;
  timeslot?: Timeslot;
  conflictFlags?: string[];  // populated by constraint checker
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

export interface ConflictReport {
  type: 'room' | 'lecturer' | 'student' | 'capacity';
  severity: 'hard' | 'soft';
  description: string;
  entryIds: string[];
}

export interface GenerationResult {
  entries: TimetableEntry[];
  conflicts: ConflictReport[];
  stats: {
    totalScheduled: number;
    hardConflicts: number;
    softConflicts: number;
    roomUtilization: number;
    lecturerUtilization: number;
    generationTimeMs: number;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
}

export interface AcademicSession {
  id: string;
  year: string;       // e.g. "2025/2026"
  semester: number;   // 1 or 2
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ─── Exam Timetable Types ─────────────────────────────────────────────────────
export interface ExamSlot {
  date: string;           // e.g. "Monday, 18th May, 2026"
  startTime: string;      // e.g. "8:00 AM"
  endTime: string;        // e.g. "10:00 AM"
  label: string;          // e.g. "8:00 AM – 10:00 AM"
}

export interface ExamEntry {
  id: string;
  faculty: string;
  courses: string[];      // e.g. ["GST 104", "GST 122"]
  venue: string;          // e.g. "ICT LABS 1 & 2"
  date: string;
  slotLabel: string;
  level: number;          // derived from course code prefix
}

// ─── Student Count Types ──────────────────────────────────────────────────────
export interface DepartmentCount {
  department: string;
  faculty: string;
  total: number;
  byLevel: Record<number, number>;  // { 100: 45, 200: 38, 300: 41, ... }
}

// ─── Settings Types ───────────────────────────────────────────────────────────
export interface AppSettings {
  theme: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  compactMode: boolean;
  notifications: boolean;
  language: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
