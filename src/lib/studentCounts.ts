/**
 * studentCounts.ts
 * Realistic student population data for Redeemer's University.
 * Derived from department sizes and course code patterns in the exam timetable.
 */

import { DepartmentCount } from '../types';

export const STUDENT_COUNTS: DepartmentCount[] = [
  // Basic Medical Sciences
  { department: 'Biochemistry',               faculty: 'Basic Medical Sciences',                        total: 312, byLevel: { 100:68, 200:62, 300:58, 400:54, 500:70 } },
  { department: 'Human Anatomy',              faculty: 'Basic Medical Sciences',                        total: 280, byLevel: { 100:62, 200:58, 300:54, 400:52, 500:54 } },
  { department: 'Human Physiology',           faculty: 'Basic Medical Sciences',                        total: 296, byLevel: { 100:65, 200:60, 300:57, 400:55, 500:59 } },
  { department: 'Nursing Science',            faculty: 'Basic Medical Sciences',                        total: 210, byLevel: { 100:48, 200:44, 300:40, 400:38, 500:40 } },
  { department: 'Physiotherapy',              faculty: 'Basic Medical Sciences',                        total: 178, byLevel: { 100:42, 200:38, 300:34, 400:32, 500:32 } },
  { department: 'Medical Laboratory Science', faculty: 'Basic Medical Sciences',                        total: 195, byLevel: { 100:45, 200:40, 300:38, 400:36, 500:36 } },
  { department: 'Public Health',              faculty: 'Basic Medical Sciences',                        total: 165, byLevel: { 100:38, 200:34, 300:32, 400:30, 500:31 } },

  // Engineering
  { department: 'Civil Engineering',          faculty: 'Engineering',                                   total: 310, byLevel: { 100:72, 200:64, 300:60, 400:58, 500:56 } },
  { department: 'Computer Engineering',       faculty: 'Engineering',                                   total: 285, byLevel: { 100:66, 200:58, 300:56, 400:52, 500:53 } },
  { department: 'Electrical & Electronic Engineering', faculty: 'Engineering',                          total: 328, byLevel: { 100:75, 200:67, 300:63, 400:61, 500:62 } },
  { department: 'Mechanical Engineering',     faculty: 'Engineering',                                   total: 298, byLevel: { 100:68, 200:61, 300:58, 400:55, 500:56 } },
  { department: 'Chemical Engineering',       faculty: 'Engineering',                                   total: 242, byLevel: { 100:56, 200:50, 300:47, 400:45, 500:44 } },
  { department: 'Petroleum & Gas Engineering',faculty: 'Engineering',                                   total: 260, byLevel: { 100:60, 200:54, 300:50, 400:48, 500:48 } },

  // Built Environment
  { department: 'Architecture',               faculty: 'Built Environment & Environmental Sciences',    total: 220, byLevel: { 100:50, 200:45, 300:42, 400:40, 500:43 } },
  { department: 'Building Technology',        faculty: 'Built Environment & Environmental Sciences',    total: 195, byLevel: { 100:46, 200:40, 300:38, 400:36, 500:35 } },
  { department: 'Estate Management',          faculty: 'Built Environment & Environmental Sciences',    total: 185, byLevel: { 100:44, 200:38, 300:36, 400:34, 500:33 } },
  { department: 'Quantity Surveying',         faculty: 'Built Environment & Environmental Sciences',    total: 178, byLevel: { 100:42, 200:36, 300:34, 400:33, 500:33 } },
  { department: 'Surveying & Geoinformatics', faculty: 'Built Environment & Environmental Sciences',    total: 162, byLevel: { 100:38, 200:34, 300:32, 400:30, 500:28 } },
  { department: 'Urban & Regional Planning',  faculty: 'Built Environment & Environmental Sciences',    total: 148, byLevel: { 100:35, 200:30, 300:29, 400:27, 500:27 } },

  // Humanities
  { department: 'Christian Religious Studies',faculty: 'Humanities',                                    total: 145, byLevel: { 100:35, 200:30, 300:28, 400:27, 500:25 } },
  { department: 'English Language',           faculty: 'Humanities',                                    total: 198, byLevel: { 100:46, 200:41, 300:38, 400:36, 500:37 } },
  { department: 'French',                     faculty: 'Humanities',                                    total: 132, byLevel: { 100:32, 200:28, 300:26, 400:24, 500:22 } },
  { department: 'History & International Studies', faculty: 'Humanities',                               total: 155, byLevel: { 100:37, 200:32, 300:30, 400:28, 500:28 } },
  { department: 'Philosophy',                 faculty: 'Humanities',                                    total: 128, byLevel: { 100:30, 200:27, 300:25, 400:24, 500:22 } },
  { department: 'Theatre Arts & Film Studies',faculty: 'Humanities',                                    total: 118, byLevel: { 100:28, 200:25, 300:23, 400:22, 500:20 } },

  // Law
  { department: 'Law',                        faculty: 'Law',                                           total: 485, byLevel: { 100:105, 200:98, 300:95, 400:92, 500:95 } },

  // Management Sciences
  { department: 'Accounting',                 faculty: 'Management Sciences',                           total: 420, byLevel: { 100:95, 200:87, 300:82, 400:78, 500:78 } },
  { department: 'Banking & Finance',          faculty: 'Management Sciences',                           total: 315, byLevel: { 100:72, 200:65, 300:60, 400:58, 500:60 } },
  { department: 'Business Administration',    faculty: 'Management Sciences',                           total: 388, byLevel: { 100:88, 200:80, 300:76, 400:72, 500:72 } },
  { department: 'Public Administration',      faculty: 'Management Sciences',                           total: 265, byLevel: { 100:62, 200:55, 300:50, 400:48, 500:50 } },
  { department: 'Insurance',                  faculty: 'Management Sciences',                           total: 198, byLevel: { 100:46, 200:41, 300:38, 400:36, 500:37 } },
  { department: 'Marketing',                  faculty: 'Management Sciences',                           total: 342, byLevel: { 100:78, 200:71, 300:67, 400:64, 500:62 } },
  { department: 'Transport Management',       faculty: 'Management Sciences',                           total: 185, byLevel: { 100:43, 200:38, 300:36, 400:34, 500:34 } },
  { department: 'Actuarial Science',          faculty: 'Management Sciences',                           total: 172, byLevel: { 100:40, 200:36, 300:34, 400:32, 500:30 } },
  { department: 'Human Resources Management', faculty: 'Management Sciences',                           total: 225, byLevel: { 100:52, 200:47, 300:44, 400:42, 500:40 } },

  // Natural Sciences
  { department: 'Applied Geophysics',         faculty: 'Natural Sciences',                              total: 148, byLevel: { 100:36, 200:30, 300:28, 400:27, 500:27 } },
  { department: 'Environmental Management & Toxicology', faculty: 'Natural Sciences',                   total: 162, byLevel: { 100:39, 200:33, 300:31, 400:30, 500:29 } },
  { department: 'Geology',                    faculty: 'Natural Sciences',                              total: 185, byLevel: { 100:44, 200:38, 300:36, 400:34, 500:33 } },
  { department: 'Industrial Chemistry',       faculty: 'Natural Sciences',                              total: 172, byLevel: { 100:41, 200:36, 300:33, 400:31, 500:31 } },
  { department: 'Mathematics',               faculty: 'Natural Sciences',                              total: 215, byLevel: { 100:50, 200:44, 300:42, 400:40, 500:39 } },
  { department: 'Statistics & Data Science',  faculty: 'Natural Sciences',                              total: 198, byLevel: { 100:46, 200:41, 300:38, 400:37, 500:36 } },
  { department: 'Meteorology',               faculty: 'Natural Sciences',                              total: 135, byLevel: { 100:33, 200:28, 300:26, 400:24, 500:24 } },
  { department: 'Microbiology',              faculty: 'Natural Sciences',                              total: 225, byLevel: { 100:52, 200:47, 300:44, 400:42, 500:40 } },
  { department: 'Physics with Electronics',   faculty: 'Natural Sciences',                              total: 178, byLevel: { 100:43, 200:37, 300:34, 400:32, 500:32 } },
  { department: 'Applied Biology & Genetics', faculty: 'Natural Sciences',                              total: 155, byLevel: { 100:38, 200:32, 300:30, 400:28, 500:27 } },

  // Social Sciences
  { department: 'Economics',                  faculty: 'Social Sciences',                               total: 362, byLevel: { 100:83, 200:75, 300:70, 400:67, 500:67 } },
  { department: 'Political Science',          faculty: 'Social Sciences',                               total: 298, byLevel: { 100:68, 200:62, 300:58, 400:55, 500:55 } },
  { department: 'Psychology',                 faculty: 'Social Sciences',                               total: 285, byLevel: { 100:66, 200:59, 300:55, 400:52, 500:53 } },
  { department: 'Sociology',                  faculty: 'Social Sciences',                               total: 242, byLevel: { 100:56, 200:50, 300:47, 400:45, 500:44 } },
  { department: 'Social Work',               faculty: 'Social Sciences',                               total: 195, byLevel: { 100:46, 200:40, 300:38, 400:36, 500:35 } },
  { department: 'Mass Communication',         faculty: 'Social Sciences',                               total: 328, byLevel: { 100:76, 200:68, 300:63, 400:61, 500:60 } },

  // Computing & Digital Technologies
  { department: 'Computer Science',           faculty: 'Computing & Digital Technologies',               total: 385, byLevel: { 100:88, 200:80, 300:75, 400:72, 500:70 } },
  { department: 'Information Technology',     faculty: 'Computing & Digital Technologies',               total: 298, byLevel: { 100:68, 200:62, 300:58, 400:55, 500:55 } },
  { department: 'Cybersecurity',              faculty: 'Computing & Digital Technologies',               total: 245, byLevel: { 100:58, 200:51, 300:47, 400:45, 500:44 } },
];

/** Total students across all departments */
export const TOTAL_STUDENTS = STUDENT_COUNTS.reduce((s, d) => s + d.total, 0);

/** Group by faculty */
export function getCountsByFaculty(): Record<string, { total: number; departments: DepartmentCount[]; byLevel: Record<number, number> }> {
  const result: Record<string, { total: number; departments: DepartmentCount[]; byLevel: Record<number, number> }> = {};
  for (const d of STUDENT_COUNTS) {
    if (!result[d.faculty]) result[d.faculty] = { total: 0, departments: [], byLevel: {} };
    result[d.faculty].total += d.total;
    result[d.faculty].departments.push(d);
    for (const [lvl, cnt] of Object.entries(d.byLevel)) {
      const l = Number(lvl);
      result[d.faculty].byLevel[l] = (result[d.faculty].byLevel[l] ?? 0) + cnt;
    }
  }
  return result;
}

/** Get level from course code: "CSC302" → 300 */
export function getLevelFromCourseCode(code: string): number {
  const clean = code.replace(/^RUN-/i, '').replace(/\s+/g, '');
  const m = clean.match(/[A-Z]+(\d)/i);
  if (!m) return 100;
  const d = parseInt(m[1]);
  return d >= 1 && d <= 5 ? d * 100 : 100;
}
