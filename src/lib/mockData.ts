import {
  User, Course, Lecturer, Room, Timeslot, TimetableEntry,
  ChangeRequest, Notification, AcademicSession
} from '../types';

// ─── Academic Sessions ────────────────────────────────────────────────────────
export const ACADEMIC_SESSIONS: AcademicSession[] = [
  { id: 'as1', year: '2025/2026', semester: 1, startDate: '2025-09-15', endDate: '2026-01-31', isActive: true  },
  { id: 'as2', year: '2025/2026', semester: 2, startDate: '2026-02-15', endDate: '2026-06-30', isActive: false },
  { id: 'as3', year: '2024/2025', semester: 2, startDate: '2025-02-15', endDate: '2025-06-30', isActive: false },
];

export function getActiveSession(): AcademicSession {
  return ACADEMIC_SESSIONS.find(s => s.isActive) ?? ACADEMIC_SESSIONS[0];
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'admin-001', name: 'Dr. Adebayo Okafor',   email: 'admin@university.edu',                      role: 'admin',    department: 'Academic Affairs',     faculty: 'Administration' },
  { id: 'lec-001',   name: 'Prof. Ngozi Adeyemi',   email: 'n.adeyemi@university.edu',                  role: 'lecturer', department: 'Computer Science',      faculty: 'Faculty of Computing & Digital Technologies',           lecturerId: 'L001', phone: '08012345601' },
  { id: 'lec-002',   name: 'Dr. Emeka Nwosu',       email: 'e.nwosu@university.edu',                    role: 'lecturer', department: 'Mathematics',           faculty: 'Faculty of Natural Sciences',                           lecturerId: 'L002', phone: '08012345602' },
  { id: 'lec-003',   name: 'Dr. Funke Balogun',     email: 'f.balogun@university.edu',                  role: 'lecturer', department: 'Biochemistry',          faculty: 'Faculty of Basic Medical Sciences',                     lecturerId: 'L003', phone: '08012345603' },
  { id: 'lec-004',   name: 'Prof. Tunde Adesanya',  email: 't.adesanya@university.edu',                 role: 'lecturer', department: 'Civil Engineering',     faculty: 'Faculty of Engineering',                                lecturerId: 'L004', phone: '08012345604' },
  { id: 'lec-005',   name: 'Dr. Yetunde Akinyele',  email: 'y.akinyele@university.edu',                 role: 'lecturer', department: 'Law',                   faculty: 'Faculty of Law',                                        lecturerId: 'L005', phone: '08012345605' },
  { id: 'lec-006',   name: 'Dr. Rotimi Fashola',    email: 'r.fashola@university.edu',                  role: 'lecturer', department: 'Accounting',            faculty: 'Faculty of Management Sciences',                        lecturerId: 'L006', phone: '08012345606' },
  { id: 'lec-007',   name: 'Prof. Chisom Obi',      email: 'c.obi@university.edu',                      role: 'lecturer', department: 'Economics',             faculty: 'Faculty of Social Sciences',                            lecturerId: 'L007', phone: '08012345607' },
  { id: 'lec-008',   name: 'Dr. Amina Danladi',     email: 'a.danladi@university.edu',                  role: 'lecturer', department: 'Architecture',          faculty: 'Faculty of Built Environment & Environmental Sciences', lecturerId: 'L008', phone: '08012345608' },
  { id: 'lec-009',   name: 'Prof. Sunday Eze',      email: 's.eze@university.edu',                      role: 'lecturer', department: 'English Language',      faculty: 'Faculty of Humanities',                                 lecturerId: 'L009', phone: '08012345609' },
  { id: 'lec-010',   name: 'Dr. Kelechi Nwafor',    email: 'k.nwafor@university.edu',                   role: 'lecturer', department: 'Cybersecurity',         faculty: 'Faculty of Computing & Digital Technologies',           lecturerId: 'L010', phone: '08012345610' },
  { id: 'stu-001',   name: 'Amara Okonkwo',         email: 'a.okonkwo@student.university.edu',          role: 'student',  department: 'Computer Science',      faculty: 'Faculty of Computing & Digital Technologies',           studentId: 'CDT/2022/001', level: 300, semester: 1 },
  { id: 'stu-002',   name: 'Chidi Eze',             email: 'c.eze@student.university.edu',              role: 'student',  department: 'Mathematics',           faculty: 'Faculty of Natural Sciences',                           studentId: 'SCI/2022/002', level: 300, semester: 1 },
  { id: 'stu-003',   name: 'Blessing Okafor',       email: 'b.okafor@student.university.edu',           role: 'student',  department: 'Biochemistry',          faculty: 'Faculty of Basic Medical Sciences',                     studentId: 'BMS/2022/003', level: 300, semester: 1 },
  { id: 'stu-004',   name: 'Seun Adeyemi',          email: 's.adeyemi@student.university.edu',          role: 'student',  department: 'Civil Engineering',     faculty: 'Faculty of Engineering',                                studentId: 'ENG/2022/004', level: 300, semester: 1 },
  { id: 'stu-005',   name: 'Tola Babatunde',        email: 't.babatunde@student.university.edu',        role: 'student',  department: 'Accounting',            faculty: 'Faculty of Management Sciences',                        studentId: 'MGT/2022/005', level: 300, semester: 1 },
  { id: 'stu-006',   name: 'Ifeanyi Obi',           email: 'i.obi@student.university.edu',              role: 'student',  department: 'Law',                   faculty: 'Faculty of Law',                                        studentId: 'LAW/2022/006', level: 300, semester: 1 },
  { id: 'stu-007',   name: 'Ngozi Chukwu',          email: 'n.chukwu@student.university.edu',           role: 'student',  department: 'Economics',             faculty: 'Faculty of Social Sciences',                            studentId: 'SOC/2022/007', level: 300, semester: 1 },
  { id: 'stu-008',   name: 'Biodun Alabi',          email: 'b.alabi@student.university.edu',            role: 'student',  department: 'Architecture',          faculty: 'Faculty of Built Environment & Environmental Sciences', studentId: 'ENV/2022/008', level: 300, semester: 1 },
  { id: 'stu-009',   name: 'Chiamaka Nnaji',        email: 'c.nnaji@student.university.edu',            role: 'student',  department: 'English Language',      faculty: 'Faculty of Humanities',                                 studentId: 'HUM/2022/009', level: 300, semester: 1 },
  { id: 'stu-010',   name: 'Emeka Okafor',          email: 'e.okafor@student.university.edu',           role: 'student',  department: 'Cybersecurity',         faculty: 'Faculty of Computing & Digital Technologies',           studentId: 'CDT/2022/010', level: 300, semester: 1 },
];

export const USER_CREDENTIALS: Record<string, string> = {
  'admin@university.edu':                   'admin123',
  'n.adeyemi@university.edu':               'lecturer123',
  'e.nwosu@university.edu':                 'lecturer123',
  'f.balogun@university.edu':               'lecturer123',
  't.adesanya@university.edu':              'lecturer123',
  'y.akinyele@university.edu':              'lecturer123',
  'r.fashola@university.edu':               'lecturer123',
  'c.obi@university.edu':                   'lecturer123',
  'a.danladi@university.edu':               'lecturer123',
  's.eze@university.edu':                   'lecturer123',
  'k.nwafor@university.edu':                'lecturer123',
  'a.okonkwo@student.university.edu':       'student123',
  'c.eze@student.university.edu':           'student123',
  'b.okafor@student.university.edu':        'student123',
  's.adeyemi@student.university.edu':       'student123',
  't.babatunde@student.university.edu':     'student123',
  'i.obi@student.university.edu':           'student123',
  'n.chukwu@student.university.edu':        'student123',
  'b.alabi@student.university.edu':         'student123',
  'c.nnaji@student.university.edu':         'student123',
  'e.okafor@student.university.edu':        'student123',
};

// ─── Courses ──────────────────────────────────────────────────────────────────
export let MOCK_COURSES: Course[] = [
  // CDT — Computer Science
  { id: 'c-cs1', code: 'CSC301', title: 'Data Structures & Algorithms',         semester:1, year:3, credits:3, enrollment:85,  courseType:'lecture', department:'Computer Science',      faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  { id: 'c-cs2', code: 'CSC302', title: 'Database Management Systems',           semester:1, year:3, credits:3, enrollment:85,  courseType:'lecture', department:'Computer Science',      faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  { id: 'c-cs3', code: 'CSC401', title: 'Artificial Intelligence',               semester:2, year:4, credits:4, enrollment:70,  courseType:'lecture', department:'Computer Science',      faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  { id: 'c-cs4', code: 'CSC201', title: 'Introduction to Programming',           semester:1, year:2, credits:3, enrollment:120, courseType:'lecture', department:'Computer Science',      faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  { id: 'c-cs5', code: 'CSC302L', title: 'Database Lab',                         semester:1, year:3, credits:1, enrollment:35,  courseType:'lab',     department:'Computer Science',      faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  // CDT — IT
  { id: 'c-it1', code: 'ITD301', title: 'Network Administration',                semester:1, year:3, credits:3, enrollment:60,  courseType:'lecture', department:'Information Technology', faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  { id: 'c-it2', code: 'ITD302', title: 'Systems Analysis & Design',             semester:1, year:3, credits:3, enrollment:60,  courseType:'lecture', department:'Information Technology', faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-001' },
  // CDT — Cybersecurity
  { id: 'c-cy1', code: 'CYB301', title: 'Ethical Hacking & Penetration Testing', semester:1, year:3, credits:3, enrollment:55,  courseType:'lab',     department:'Cybersecurity',         faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-010' },
  { id: 'c-cy2', code: 'CYB302', title: 'Digital Forensics',                     semester:1, year:3, credits:3, enrollment:55,  courseType:'lecture', department:'Cybersecurity',         faculty:'Faculty of Computing & Digital Technologies', lecturer_id:'lec-010' },
  // Natural Sciences — Mathematics
  { id: 'c-mt1', code: 'MTH301', title: 'Linear Algebra',                        semester:1, year:3, credits:3, enrollment:95,  courseType:'lecture', department:'Mathematics',           faculty:'Faculty of Natural Sciences', lecturer_id:'lec-002' },
  { id: 'c-mt2', code: 'MTH401', title: 'Numerical Analysis',                    semester:2, year:4, credits:3, enrollment:75,  courseType:'lecture', department:'Mathematics',           faculty:'Faculty of Natural Sciences', lecturer_id:'lec-002' },
  { id: 'c-mt3', code: 'MTH302', title: 'Real Analysis',                         semester:2, year:3, credits:3, enrollment:80,  courseType:'lecture', department:'Mathematics',           faculty:'Faculty of Natural Sciences', lecturer_id:'lec-002' },
  // BMS — Biochemistry
  { id: 'c-bc1', code: 'BCH301', title: 'Molecular Biology',                     semester:1, year:3, credits:3, enrollment:65,  courseType:'lecture', department:'Biochemistry',          faculty:'Faculty of Basic Medical Sciences', lecturer_id:'lec-003' },
  { id: 'c-bc2', code: 'BCH302', title: 'Enzymology & Metabolism',               semester:1, year:3, credits:3, enrollment:65,  courseType:'lecture', department:'Biochemistry',          faculty:'Faculty of Basic Medical Sciences', lecturer_id:'lec-003' },
  { id: 'c-bc3', code: 'BCH401', title: 'Clinical Biochemistry',                 semester:2, year:4, credits:3, enrollment:50,  courseType:'lecture', department:'Biochemistry',          faculty:'Faculty of Basic Medical Sciences', lecturer_id:'lec-003' },
  // Engineering — Civil
  { id: 'c-cv1', code: 'CVE301', title: 'Structural Analysis',                   semester:1, year:3, credits:4, enrollment:75,  courseType:'lecture', department:'Civil Engineering',     faculty:'Faculty of Engineering', lecturer_id:'lec-004' },
  { id: 'c-cv2', code: 'CVE302', title: 'Fluid Mechanics',                       semester:1, year:3, credits:3, enrollment:75,  courseType:'lecture', department:'Civil Engineering',     faculty:'Faculty of Engineering', lecturer_id:'lec-004' },
  { id: 'c-cv3', code: 'CVE401', title: 'Foundation Engineering',                semester:2, year:4, credits:3, enrollment:60,  courseType:'lecture', department:'Civil Engineering',     faculty:'Faculty of Engineering', lecturer_id:'lec-004' },
  // Law
  { id: 'c-lw1', code: 'LAW301', title: 'Constitutional Law',                    semester:1, year:3, credits:4, enrollment:90,  courseType:'seminar', department:'Law',                  faculty:'Faculty of Law', lecturer_id:'lec-005' },
  { id: 'c-lw2', code: 'LAW302', title: 'Law of Contract',                       semester:1, year:3, credits:4, enrollment:90,  courseType:'seminar', department:'Law',                  faculty:'Faculty of Law', lecturer_id:'lec-005' },
  { id: 'c-lw3', code: 'LAW401', title: 'Criminal Law & Procedure',              semester:2, year:4, credits:4, enrollment:70,  courseType:'seminar', department:'Law',                  faculty:'Faculty of Law', lecturer_id:'lec-005' },
  // Management — Accounting
  { id: 'c-ac1', code: 'ACC301', title: 'Financial Accounting',                  semester:1, year:3, credits:3, enrollment:110, courseType:'lecture', department:'Accounting',           faculty:'Faculty of Management Sciences', lecturer_id:'lec-006' },
  { id: 'c-ac2', code: 'ACC302', title: 'Management Accounting',                 semester:2, year:3, credits:3, enrollment:110, courseType:'lecture', department:'Accounting',           faculty:'Faculty of Management Sciences', lecturer_id:'lec-006' },
  // Social Sciences — Economics
  { id: 'c-ec1', code: 'ECO301', title: 'Microeconomic Theory',                  semester:1, year:3, credits:3, enrollment:130, courseType:'lecture', department:'Economics',             faculty:'Faculty of Social Sciences', lecturer_id:'lec-007' },
  { id: 'c-ec2', code: 'ECO302', title: 'Macroeconomic Theory',                  semester:2, year:3, credits:3, enrollment:130, courseType:'lecture', department:'Economics',             faculty:'Faculty of Social Sciences', lecturer_id:'lec-007' },
  // Built Environment — Architecture
  { id: 'c-ar1', code: 'ARC301', title: 'Architectural Design Studio III',       semester:1, year:3, credits:6, enrollment:40,  courseType:'studio',  department:'Architecture',          faculty:'Faculty of Built Environment & Environmental Sciences', lecturer_id:'lec-008' },
  { id: 'c-ar2', code: 'ARC302', title: 'Building Technology & Services',        semester:1, year:3, credits:3, enrollment:40,  courseType:'lecture', department:'Architecture',          faculty:'Faculty of Built Environment & Environmental Sciences', lecturer_id:'lec-008' },
  // Humanities — English
  { id: 'c-el1', code: 'ENG301', title: 'Stylistics & Literary Criticism',       semester:1, year:3, credits:3, enrollment:80,  courseType:'seminar', department:'English Language',      faculty:'Faculty of Humanities', lecturer_id:'lec-009' },
  { id: 'c-el2', code: 'ENG302', title: 'History of the English Language',       semester:2, year:3, credits:3, enrollment:80,  courseType:'lecture', department:'English Language',      faculty:'Faculty of Humanities', lecturer_id:'lec-009' },
];

// ─── Lecturers ────────────────────────────────────────────────────────────────
export let MOCK_LECTURERS: Lecturer[] = [
  { id:'lec-001', name:'Prof. Ngozi Adeyemi',  email:'n.adeyemi@university.edu', department:'Computer Science',    faculty:'Faculty of Computing & Digital Technologies',           title:'Professor', maxHoursPerWeek:12, unavailableSlots:['t3','t15'] },
  { id:'lec-002', name:'Dr. Emeka Nwosu',      email:'e.nwosu@university.edu',   department:'Mathematics',          faculty:'Faculty of Natural Sciences',                           title:'Doctor',    maxHoursPerWeek:10, unavailableSlots:['t1'] },
  { id:'lec-003', name:'Dr. Funke Balogun',    email:'f.balogun@university.edu', department:'Biochemistry',         faculty:'Faculty of Basic Medical Sciences',                    title:'Doctor',    maxHoursPerWeek:10 },
  { id:'lec-004', name:'Prof. Tunde Adesanya', email:'t.adesanya@university.edu',department:'Civil Engineering',    faculty:'Faculty of Engineering',                              title:'Professor', maxHoursPerWeek:12 },
  { id:'lec-005', name:'Dr. Yetunde Akinyele', email:'y.akinyele@university.edu',department:'Law',                  faculty:'Faculty of Law',                                      title:'Doctor',    maxHoursPerWeek:10 },
  { id:'lec-006', name:'Dr. Rotimi Fashola',   email:'r.fashola@university.edu', department:'Accounting',           faculty:'Faculty of Management Sciences',                      title:'Doctor',    maxHoursPerWeek:10 },
  { id:'lec-007', name:'Prof. Chisom Obi',     email:'c.obi@university.edu',     department:'Economics',             faculty:'Faculty of Social Sciences',                          title:'Professor', maxHoursPerWeek:12 },
  { id:'lec-008', name:'Dr. Amina Danladi',    email:'a.danladi@university.edu', department:'Architecture',         faculty:'Faculty of Built Environment & Environmental Sciences',title:'Doctor',    maxHoursPerWeek:10 },
  { id:'lec-009', name:'Prof. Sunday Eze',     email:'s.eze@university.edu',     department:'English Language',     faculty:'Faculty of Humanities',                               title:'Professor', maxHoursPerWeek:10 },
  { id:'lec-010', name:'Dr. Kelechi Nwafor',   email:'k.nwafor@university.edu',  department:'Cybersecurity',        faculty:'Faculty of Computing & Digital Technologies',          title:'Doctor',    maxHoursPerWeek:10 },
];

// ─── Rooms ────────────────────────────────────────────────────────────────────
export let MOCK_ROOMS: Room[] = [
  { id:'r1',  name:'LT-101',   capacity:200, type:'Lecture Theatre', building:'Block A',       available:true,  facilities:['projector','AC','microphone'] },
  { id:'r2',  name:'LT-102',   capacity:150, type:'Lecture Theatre', building:'Block A',       available:true,  facilities:['projector','AC'] },
  { id:'r3',  name:'LT-201',   capacity:180, type:'Lecture Theatre', building:'Block B',       available:true,  facilities:['projector','AC','microphone'] },
  { id:'r4',  name:'LAB-101',  capacity:40,  type:'Computer Lab',    building:'Block B',       available:true,  facilities:['computers','AC'] },
  { id:'r5',  name:'LAB-102',  capacity:40,  type:'Computer Lab',    building:'Block B',       available:true,  facilities:['computers','AC'] },
  { id:'r6',  name:'CR-301',   capacity:60,  type:'Classroom',       building:'Block C',       available:true,  facilities:['whiteboard'] },
  { id:'r7',  name:'CR-302',   capacity:80,  type:'Classroom',       building:'Block C',       available:true,  facilities:['whiteboard','projector'] },
  { id:'r8',  name:'LAW-101',  capacity:100, type:'Moot Court',      building:'Law Block',     available:true,  facilities:['microphone','recording'] },
  { id:'r9',  name:'MED-101',  capacity:60,  type:'Science Lab',     building:'Medical Block', available:true,  facilities:['fume_hood','microscopes'] },
  { id:'r10', name:'ARC-101',  capacity:45,  type:'Design Studio',   building:'Env. Block',    available:true,  facilities:['drawing_tables','plotters'] },
  { id:'r11', name:'LT-301',   capacity:250, type:'Lecture Theatre', building:'Main Hall',     available:true,  facilities:['projector','AC','microphone','livestream'] },
  { id:'r12', name:'SEM-101',  capacity:30,  type:'Seminar Room',    building:'Block C',       available:true,  facilities:['projector','whiteboard'] },
];

// ─── Timeslots ────────────────────────────────────────────────────────────────
export let MOCK_TIMESLOTS: Timeslot[] = [
  { id:'t1',  day:'Monday',    start_time:'08:00', end_time:'10:00', period:1 },
  { id:'t2',  day:'Monday',    start_time:'10:00', end_time:'12:00', period:2 },
  { id:'t3',  day:'Monday',    start_time:'14:00', end_time:'16:00', period:3 },
  { id:'t4',  day:'Tuesday',   start_time:'08:00', end_time:'10:00', period:1 },
  { id:'t5',  day:'Tuesday',   start_time:'10:00', end_time:'12:00', period:2 },
  { id:'t6',  day:'Tuesday',   start_time:'14:00', end_time:'16:00', period:3 },
  { id:'t7',  day:'Wednesday', start_time:'08:00', end_time:'10:00', period:1 },
  { id:'t8',  day:'Wednesday', start_time:'10:00', end_time:'12:00', period:2 },
  { id:'t9',  day:'Wednesday', start_time:'14:00', end_time:'16:00', period:3 },
  { id:'t10', day:'Thursday',  start_time:'08:00', end_time:'10:00', period:1 },
  { id:'t11', day:'Thursday',  start_time:'10:00', end_time:'12:00', period:2 },
  { id:'t12', day:'Thursday',  start_time:'14:00', end_time:'16:00', period:3 },
  { id:'t13', day:'Friday',    start_time:'08:00', end_time:'10:00', period:1 },
  { id:'t14', day:'Friday',    start_time:'10:00', end_time:'12:00', period:2 },
  { id:'t15', day:'Friday',    start_time:'12:00', end_time:'14:00', period:3 },
];

// ─── Timetable (initial hand-crafted entries) ─────────────────────────────────
export let MOCK_TIMETABLE: TimetableEntry[] = [
  { id:'tt1',  course_id:'c-cs1', lecturer_id:'lec-001', room_id:'r1',  timeslot_id:'t1',  semester:1, academicYear:'2025/2026' },
  { id:'tt2',  course_id:'c-cs2', lecturer_id:'lec-001', room_id:'r4',  timeslot_id:'t4',  semester:1, academicYear:'2025/2026' },
  { id:'tt3',  course_id:'c-cs3', lecturer_id:'lec-001', room_id:'r1',  timeslot_id:'t7',  semester:2, academicYear:'2025/2026' },
  { id:'tt4',  course_id:'c-cs4', lecturer_id:'lec-001', room_id:'r2',  timeslot_id:'t13', semester:1, academicYear:'2025/2026' },
  { id:'tt5',  course_id:'c-cs5', lecturer_id:'lec-001', room_id:'r4',  timeslot_id:'t2',  semester:1, academicYear:'2025/2026' },
  { id:'tt6',  course_id:'c-it1', lecturer_id:'lec-001', room_id:'r5',  timeslot_id:'t5',  semester:1, academicYear:'2025/2026' },
  { id:'tt7',  course_id:'c-it2', lecturer_id:'lec-001', room_id:'r6',  timeslot_id:'t10', semester:1, academicYear:'2025/2026' },
  { id:'tt8',  course_id:'c-cy1', lecturer_id:'lec-010', room_id:'r5',  timeslot_id:'t11', semester:1, academicYear:'2025/2026' },
  { id:'tt9',  course_id:'c-cy2', lecturer_id:'lec-010', room_id:'r7',  timeslot_id:'t14', semester:1, academicYear:'2025/2026' },
  { id:'tt10', course_id:'c-mt1', lecturer_id:'lec-002', room_id:'r2',  timeslot_id:'t2',  semester:1, academicYear:'2025/2026' },
  { id:'tt11', course_id:'c-mt2', lecturer_id:'lec-002', room_id:'r6',  timeslot_id:'t8',  semester:2, academicYear:'2025/2026' },
  { id:'tt12', course_id:'c-mt3', lecturer_id:'lec-002', room_id:'r7',  timeslot_id:'t14', semester:2, academicYear:'2025/2026' },
  { id:'tt13', course_id:'c-bc1', lecturer_id:'lec-003', room_id:'r9',  timeslot_id:'t1',  semester:1, academicYear:'2025/2026' },
  { id:'tt14', course_id:'c-bc2', lecturer_id:'lec-003', room_id:'r9',  timeslot_id:'t5',  semester:1, academicYear:'2025/2026' },
  { id:'tt15', course_id:'c-bc3', lecturer_id:'lec-003', room_id:'r9',  timeslot_id:'t9',  semester:2, academicYear:'2025/2026' },
  { id:'tt16', course_id:'c-cv1', lecturer_id:'lec-004', room_id:'r1',  timeslot_id:'t10', semester:1, academicYear:'2025/2026' },
  { id:'tt17', course_id:'c-cv2', lecturer_id:'lec-004', room_id:'r2',  timeslot_id:'t6',  semester:1, academicYear:'2025/2026' },
  { id:'tt18', course_id:'c-cv3', lecturer_id:'lec-004', room_id:'r3',  timeslot_id:'t11', semester:2, academicYear:'2025/2026' },
  { id:'tt19', course_id:'c-lw1', lecturer_id:'lec-005', room_id:'r8',  timeslot_id:'t1',  semester:1, academicYear:'2025/2026' },
  { id:'tt20', course_id:'c-lw2', lecturer_id:'lec-005', room_id:'r8',  timeslot_id:'t7',  semester:1, academicYear:'2025/2026' },
  { id:'tt21', course_id:'c-lw3', lecturer_id:'lec-005', room_id:'r8',  timeslot_id:'t12', semester:2, academicYear:'2025/2026' },
  { id:'tt22', course_id:'c-ac1', lecturer_id:'lec-006', room_id:'r3',  timeslot_id:'t2',  semester:1, academicYear:'2025/2026' },
  { id:'tt23', course_id:'c-ac2', lecturer_id:'lec-006', room_id:'r3',  timeslot_id:'t8',  semester:2, academicYear:'2025/2026' },
  { id:'tt24', course_id:'c-ec1', lecturer_id:'lec-007', room_id:'r11', timeslot_id:'t5',  semester:1, academicYear:'2025/2026' },
  { id:'tt25', course_id:'c-ec2', lecturer_id:'lec-007', room_id:'r11', timeslot_id:'t10', semester:2, academicYear:'2025/2026' },
  { id:'tt26', course_id:'c-ar1', lecturer_id:'lec-008', room_id:'r10', timeslot_id:'t4',  semester:1, academicYear:'2025/2026' },
  { id:'tt27', course_id:'c-ar2', lecturer_id:'lec-008', room_id:'r10', timeslot_id:'t8',  semester:1, academicYear:'2025/2026' },
  { id:'tt28', course_id:'c-el1', lecturer_id:'lec-009', room_id:'r7',  timeslot_id:'t6',  semester:1, academicYear:'2025/2026' },
  { id:'tt29', course_id:'c-el2', lecturer_id:'lec-009', room_id:'r7',  timeslot_id:'t12', semester:2, academicYear:'2025/2026' },
];

// ─── Change Requests ──────────────────────────────────────────────────────────
export let MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
  { id:'cr1', requester_id:'lec-001', requester_name:'Prof. Ngozi Adeyemi',  requester_role:'lecturer', timetable_id:'tt1', course_name:'CSC301 - Data Structures & Algorithms', current_day:'Monday',    current_time:'08:00 - 10:00', requested_day:'Wednesday', requested_time:'10:00 - 12:00', reason:'Conflict with departmental seminar every Monday morning.',         status:'pending',  created_at:'2026-05-20T09:00:00Z' },
  { id:'cr2', requester_id:'stu-001', requester_name:'Amara Okonkwo',        requester_role:'student',  timetable_id:'tt2', course_name:'CSC302 - Database Management Systems',   current_day:'Tuesday',   current_time:'08:00 - 10:00', requested_day:'Thursday',  requested_time:'10:00 - 12:00', reason:'Clash with compulsory General Studies class at same time.',       status:'pending',  created_at:'2026-05-21T11:00:00Z' },
  { id:'cr3', requester_id:'lec-004', requester_name:'Prof. Tunde Adesanya', requester_role:'lecturer', timetable_id:'tt16', course_name:'CVE301 - Structural Analysis',           current_day:'Thursday',  current_time:'08:00 - 10:00', requested_day:'Monday',    requested_time:'10:00 - 12:00', reason:'Thursday slot conflicts with faculty board meeting.',             status:'approved', created_at:'2026-05-18T08:30:00Z', admin_response:'Approved — new slot confirmed.' },
  { id:'cr4', requester_id:'lec-007', requester_name:'Prof. Chisom Obi',     requester_role:'lecturer', timetable_id:'tt24', course_name:'ECO301 - Microeconomic Theory',           current_day:'Tuesday',   current_time:'10:00 - 12:00', requested_day:'Friday',    requested_time:'08:00 - 10:00', reason:'LT-301 better suited earlier; currently used for another faculty.', status:'rejected', created_at:'2026-05-17T14:00:00Z', admin_response:'Rejected — Friday 08:00 already occupied by another large class.' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export let MOCK_NOTIFICATIONS: Notification[] = [
  { id:'n1', user_id:'lec-001', message:'Your change request for CSC301 is pending review.', type:'info',    read:false, created_at:'2026-05-20T09:01:00Z' },
  { id:'n2', user_id:'lec-004', message:'Your change request for CVE301 has been approved!', type:'success', read:false, created_at:'2026-05-18T08:35:00Z' },
  { id:'n3', user_id:'lec-007', message:'Your change request for ECO301 was rejected.',       type:'error',   read:true,  created_at:'2026-05-17T14:05:00Z' },
  { id:'n4', user_id:'admin-001', message:'2 new change requests awaiting your review.',      type:'warning', read:false, created_at:'2026-05-21T11:01:00Z' },
  { id:'n5', user_id:'stu-001',   message:'Your timetable for Semester 1 is now published.', type:'success', read:false, created_at:'2026-05-15T09:00:00Z' },
];

// ─── Mutation Helpers ─────────────────────────────────────────────────────────
export function addCourse(course: Omit<Course, 'id'>): Course {
  const c = { ...course, id: `c${Date.now()}` };
  MOCK_COURSES = [...MOCK_COURSES, c]; return c;
}
export function updateCourse(id: string, u: Partial<Course>): void {
  MOCK_COURSES = MOCK_COURSES.map(c => c.id === id ? { ...c, ...u } : c);
}
export function deleteCourse(id: string): void {
  MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== id);
}
export function addLecturer(lecturer: Omit<Lecturer, 'id'>): Lecturer {
  const l = { ...lecturer, id: `lec-${Date.now()}` };
  MOCK_LECTURERS = [...MOCK_LECTURERS, l]; return l;
}
export function updateLecturer(id: string, u: Partial<Lecturer>): void {
  MOCK_LECTURERS = MOCK_LECTURERS.map(l => l.id === id ? { ...l, ...u } : l);
}
export function deleteLecturer(id: string): void {
  MOCK_LECTURERS = MOCK_LECTURERS.filter(l => l.id !== id);
}
export function addRoom(room: Omit<Room, 'id'>): Room {
  const r = { ...room, id: `r${Date.now()}` };
  MOCK_ROOMS = [...MOCK_ROOMS, r]; return r;
}
export function updateRoom(id: string, u: Partial<Room>): void {
  MOCK_ROOMS = MOCK_ROOMS.map(r => r.id === id ? { ...r, ...u } : r);
}
export function deleteRoom(id: string): void {
  MOCK_ROOMS = MOCK_ROOMS.filter(r => r.id !== id);
}
export function addTimeslot(timeslot: Omit<Timeslot, 'id'>): Timeslot {
  const t = { ...timeslot, id: `t${Date.now()}` };
  MOCK_TIMESLOTS = [...MOCK_TIMESLOTS, t]; return t;
}
export function addChangeRequest(req: Omit<ChangeRequest, 'id' | 'created_at'>): ChangeRequest {
  const r = { ...req, id: `cr${Date.now()}`, created_at: new Date().toISOString() };
  MOCK_CHANGE_REQUESTS = [...MOCK_CHANGE_REQUESTS, r]; return r;
}
export function updateChangeRequest(id: string, u: Partial<ChangeRequest>): void {
  MOCK_CHANGE_REQUESTS = MOCK_CHANGE_REQUESTS.map(r => r.id === id ? { ...r, ...u } : r);
}
export function markNotificationRead(id: string): void {
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => n.id === id ? { ...n, read: true } : n);
}
export function addNotification(n: Omit<Notification, 'id' | 'created_at'>): Notification {
  const notif = { ...n, id: `n${Date.now()}`, created_at: new Date().toISOString() };
  MOCK_NOTIFICATIONS = [...MOCK_NOTIFICATIONS, notif]; return notif;
}

/** Replace the live timetable with generated entries for a given semester */
export function applyGeneratedTimetable(entries: import('../types').TimetableEntry[], semester: number): void {
  MOCK_TIMETABLE = [
    ...MOCK_TIMETABLE.filter(t => t.semester !== semester),
    ...entries,
  ];
}

export function getTimetableWithDetails(): TimetableEntry[] {
  return MOCK_TIMETABLE.map(entry => ({
    ...entry,
    course:   MOCK_COURSES.find(c => c.id === entry.course_id),
    lecturer: MOCK_LECTURERS.find(l => l.id === entry.lecturer_id),
    room:     MOCK_ROOMS.find(r => r.id === entry.room_id),
    timeslot: MOCK_TIMESLOTS.find(t => t.id === entry.timeslot_id),
  }));
}
