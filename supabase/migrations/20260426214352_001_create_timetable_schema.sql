/*
  # Initialize Multilayer Perceptron Timetable Scheduling System

  1. New Tables
    - `faculties` - University faculties
    - `departments` - Academic departments within faculties
    - `lecturers` - Teaching staff members
    - `rooms` - Classroom facilities with capacity
    - `timeslots` - Available class time periods
    - `courses` - Academic courses offered
    - `timetable` - Generated schedule assignments
    - `model_metadata` - MLP model training information

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access

  3. Indexes
    - Added for foreign key relationships and frequent queries
*/

CREATE TABLE IF NOT EXISTS faculties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  faculty_id uuid NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(code, faculty_id)
);

CREATE TABLE IF NOT EXISTS lecturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  availability_pattern text DEFAULT 'standard',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  capacity integer NOT NULL CHECK (capacity > 0),
  room_type text DEFAULT 'lecture',
  building text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timeslots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(day, start_time, end_time),
  CONSTRAINT valid_time CHECK (start_time < end_time)
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  duration integer NOT NULL DEFAULT 2 CHECK (duration > 0),
  semester integer NOT NULL CHECK (semester IN (1, 2)),
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(code, semester, year)
);

CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lecturer_id uuid NOT NULL REFERENCES lecturers(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  timeslot_id uuid NOT NULL REFERENCES timeslots(id) ON DELETE CASCADE,
  semester integer NOT NULL,
  year integer NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, lecturer_id, semester, year)
);

CREATE TABLE IF NOT EXISTS model_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version text NOT NULL,
  training_timestamp timestamptz DEFAULT now(),
  accuracy numeric,
  training_samples integer,
  layers text,
  model_file text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_departments_faculty_id ON departments(faculty_id);
CREATE INDEX idx_lecturers_department_id ON lecturers(department_id);
CREATE INDEX idx_courses_department_id ON courses(department_id);
CREATE INDEX idx_courses_semester_year ON courses(semester, year);
CREATE INDEX idx_timetable_course_id ON timetable(course_id);
CREATE INDEX idx_timetable_lecturer_id ON timetable(lecturer_id);
CREATE INDEX idx_timetable_room_id ON timetable(room_id);
CREATE INDEX idx_timetable_timeslot_id ON timetable(timeslot_id);
CREATE INDEX idx_timetable_semester_year ON timetable(semester, year);

ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for all tables"
  ON faculties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for lecturers"
  ON lecturers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for timeslots"
  ON timeslots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for timetable"
  ON timetable FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for model_metadata"
  ON model_metadata FOR SELECT
  TO authenticated
  USING (true);
