import { Faculty, Department } from '../types';

// ─── Faculty Colour Palette ────────────────────────────────────────────────────
// Each faculty gets a distinct colour used everywhere: timetable cells, badges, headers
export const FACULTIES: Faculty[] = [
  {
    id: 'fac-bms',
    name: 'Faculty of Basic Medical Sciences',
    shortCode: 'BMS',
    color: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      badge: 'bg-red-100 text-red-700',
      header: 'bg-red-600',
      dot: 'bg-red-500',
    },
  },
  {
    id: 'fac-eng',
    name: 'Faculty of Engineering',
    shortCode: 'ENG',
    color: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-800',
      badge: 'bg-orange-100 text-orange-700',
      header: 'bg-orange-600',
      dot: 'bg-orange-500',
    },
  },
  {
    id: 'fac-env',
    name: 'Faculty of Built Environment & Environmental Sciences',
    shortCode: 'ENV',
    color: {
      bg: 'bg-lime-50',
      border: 'border-lime-300',
      text: 'text-lime-800',
      badge: 'bg-lime-100 text-lime-700',
      header: 'bg-lime-600',
      dot: 'bg-lime-500',
    },
  },
  {
    id: 'fac-hum',
    name: 'Faculty of Humanities',
    shortCode: 'HUM',
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-700',
      header: 'bg-purple-600',
      dot: 'bg-purple-500',
    },
  },
  {
    id: 'fac-law',
    name: 'Faculty of Law',
    shortCode: 'LAW',
    color: {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-slate-800',
      badge: 'bg-slate-100 text-slate-700',
      header: 'bg-slate-600',
      dot: 'bg-slate-500',
    },
  },
  {
    id: 'fac-mgt',
    name: 'Faculty of Management Sciences',
    shortCode: 'MGT',
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-700',
      header: 'bg-amber-600',
      dot: 'bg-amber-500',
    },
  },
  {
    id: 'fac-sci',
    name: 'Faculty of Natural Sciences',
    shortCode: 'SCI',
    color: {
      bg: 'bg-teal-50',
      border: 'border-teal-300',
      text: 'text-teal-800',
      badge: 'bg-teal-100 text-teal-700',
      header: 'bg-teal-600',
      dot: 'bg-teal-500',
    },
  },
  {
    id: 'fac-soc',
    name: 'Faculty of Social Sciences',
    shortCode: 'SOC',
    color: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-800',
      badge: 'bg-sky-100 text-sky-700',
      header: 'bg-sky-600',
      dot: 'bg-sky-500',
    },
  },
  {
    id: 'fac-cdt',
    name: 'Faculty of Computing & Digital Technologies',
    shortCode: 'CDT',
    color: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      text: 'text-indigo-800',
      badge: 'bg-indigo-100 text-indigo-700',
      header: 'bg-indigo-600',
      dot: 'bg-indigo-500',
    },
  },
];

export const DEPARTMENTS: Department[] = [
  // Basic Medical Sciences
  { id: 'dep-biochem',  name: 'Biochemistry',              facultyId: 'fac-bms' },
  { id: 'dep-anat',     name: 'Human Anatomy',             facultyId: 'fac-bms' },
  { id: 'dep-physiol',  name: 'Human Physiology',          facultyId: 'fac-bms' },
  { id: 'dep-nurs',     name: 'Nursing Science',           facultyId: 'fac-bms' },
  { id: 'dep-physio',   name: 'Physiotherapy',             facultyId: 'fac-bms' },
  { id: 'dep-mls',      name: 'Medical Laboratory Science',facultyId: 'fac-bms' },
  { id: 'dep-pub',      name: 'Public Health',             facultyId: 'fac-bms' },

  // Engineering
  { id: 'dep-civil',    name: 'Civil Engineering',                  facultyId: 'fac-eng' },
  { id: 'dep-compeng',  name: 'Computer Engineering',               facultyId: 'fac-eng' },
  { id: 'dep-eee',      name: 'Electrical & Electronic Engineering', facultyId: 'fac-eng' },
  { id: 'dep-mech',     name: 'Mechanical Engineering',             facultyId: 'fac-eng' },
  { id: 'dep-chem',     name: 'Chemical Engineering',               facultyId: 'fac-eng' },
  { id: 'dep-petro',    name: 'Petroleum & Gas Engineering',        facultyId: 'fac-eng' },

  // Built Environment
  { id: 'dep-arch',     name: 'Architecture',             facultyId: 'fac-env' },
  { id: 'dep-build',    name: 'Building Technology',      facultyId: 'fac-env' },
  { id: 'dep-estate',   name: 'Estate Management',        facultyId: 'fac-env' },
  { id: 'dep-qty',      name: 'Quantity Surveying',       facultyId: 'fac-env' },
  { id: 'dep-surv',     name: 'Surveying & Geoinformatics',facultyId: 'fac-env' },
  { id: 'dep-urp',      name: 'Urban & Regional Planning',facultyId: 'fac-env' },

  // Humanities
  { id: 'dep-crs',      name: 'Christian Religious Studies',         facultyId: 'fac-hum' },
  { id: 'dep-eng',      name: 'English Language',                    facultyId: 'fac-hum' },
  { id: 'dep-fre',      name: 'French',                              facultyId: 'fac-hum' },
  { id: 'dep-his',      name: 'History & International Studies',     facultyId: 'fac-hum' },
  { id: 'dep-phil',     name: 'Philosophy',                          facultyId: 'fac-hum' },
  { id: 'dep-thea',     name: 'Theatre Arts & Film Studies',         facultyId: 'fac-hum' },

  // Law
  { id: 'dep-law',      name: 'Law',                    facultyId: 'fac-law' },

  // Management Sciences
  { id: 'dep-acc',      name: 'Accounting',                              facultyId: 'fac-mgt' },
  { id: 'dep-bnk',      name: 'Banking & Finance',                       facultyId: 'fac-mgt' },
  { id: 'dep-biz',      name: 'Business Administration',                 facultyId: 'fac-mgt' },
  { id: 'dep-padm',     name: 'Public Administration',                   facultyId: 'fac-mgt' },
  { id: 'dep-ins',      name: 'Insurance',                               facultyId: 'fac-mgt' },
  { id: 'dep-mkt',      name: 'Marketing',                               facultyId: 'fac-mgt' },
  { id: 'dep-trans',    name: 'Transport Management',                    facultyId: 'fac-mgt' },
  { id: 'dep-act',      name: 'Actuarial Science',                       facultyId: 'fac-mgt' },
  { id: 'dep-hrm',      name: 'Human Resources Management',              facultyId: 'fac-mgt' },

  // Natural Sciences
  { id: 'dep-geoph',    name: 'Applied Geophysics',                  facultyId: 'fac-sci' },
  { id: 'dep-envtox',   name: 'Environmental Management & Toxicology',facultyId: 'fac-sci' },
  { id: 'dep-geo',      name: 'Geology',                             facultyId: 'fac-sci' },
  { id: 'dep-indchem',  name: 'Industrial Chemistry',                facultyId: 'fac-sci' },
  { id: 'dep-math',     name: 'Mathematics',                         facultyId: 'fac-sci' },
  { id: 'dep-stats',    name: 'Statistics & Data Science',           facultyId: 'fac-sci' },
  { id: 'dep-meteo',    name: 'Meteorology',                         facultyId: 'fac-sci' },
  { id: 'dep-micro',    name: 'Microbiology',                        facultyId: 'fac-sci' },
  { id: 'dep-phy',      name: 'Physics with Electronics',            facultyId: 'fac-sci' },
  { id: 'dep-bio',      name: 'Applied Biology & Genetics',          facultyId: 'fac-sci' },

  // Social Sciences
  { id: 'dep-econ',     name: 'Economics',          facultyId: 'fac-soc' },
  { id: 'dep-polsci',   name: 'Political Science',  facultyId: 'fac-soc' },
  { id: 'dep-psych',    name: 'Psychology',         facultyId: 'fac-soc' },
  { id: 'dep-soc',      name: 'Sociology',          facultyId: 'fac-soc' },
  { id: 'dep-sw',       name: 'Social Work',        facultyId: 'fac-soc' },
  { id: 'dep-masscom',  name: 'Mass Communication', facultyId: 'fac-soc' },

  // Computing & Digital Technologies
  { id: 'dep-cs',       name: 'Computer Science',    facultyId: 'fac-cdt' },
  { id: 'dep-it',       name: 'Information Technology', facultyId: 'fac-cdt' },
  { id: 'dep-cyber',    name: 'Cybersecurity',       facultyId: 'fac-cdt' },
];

/** Look up a faculty by department name */
export function getFacultyByDept(departmentName: string): Faculty | undefined {
  const dept = DEPARTMENTS.find(d => d.name === departmentName);
  if (!dept) return undefined;
  return FACULTIES.find(f => f.id === dept.facultyId);
}

/** Get all departments belonging to a faculty */
export function getDeptsByFaculty(facultyId: string): Department[] {
  return DEPARTMENTS.filter(d => d.facultyId === facultyId);
}
