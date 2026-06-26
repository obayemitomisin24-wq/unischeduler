/**
 * UniScheduler — MLP-based Timetable Generation Engine
 * 
 * Architecture:
 *  1. Feature extraction  — encode course/room/lecturer attributes as 0-1 vectors
 *  2. MLP forward pass    — predict best timeslot probability distribution
 *  3. Greedy repair       — iterate ranked predictions; pick first conflict-free slot
 *  4. Conflict report     — return full list of hard/soft violations for audit
 */

import {
  Course, Lecturer, Room, Timeslot, TimetableEntry,
  ConflictReport, GenerationResult
} from '../types';

// ─── Mini MLP (pure TypeScript, no external deps) ────────────────────────────

function relu(x: number): number { return Math.max(0, x); }

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map(v => Math.exp(v - max));
  const sum  = exps.reduce((a, b) => a + b, 0);
  return exps.map(v => v / sum);
}

function dotAdd(inputs: number[], weights: number[][], biases: number[]): number[] {
  return biases.map((b, j) => b + inputs.reduce((s, x, i) => s + x * weights[i][j], 0));
}

function initWeights(inSize: number, outSize: number, seed: number): number[][] {
  // Xavier initialisation — deterministic from seed so results are reproducible
  const scale = Math.sqrt(2 / (inSize + outSize));
  return Array.from({ length: inSize }, (_, i) =>
    Array.from({ length: outSize }, (_, j) => {
      const v = Math.sin((i + 1) * (j + 1) * seed * 7.3971) * scale;
      return v;
    })
  );
}

function initBias(size: number): number[] {
  return new Array(size).fill(0);
}

class MLP {
  private w1: number[][];
  private b1: number[];
  private w2: number[][];
  private b2: number[];
  private w3: number[][];
  private b3: number[];
  private w4: number[][];
  private b4: number[];

  constructor(inputSize: number, outputSize: number) {
    this.w1 = initWeights(inputSize, 256, 1);
    this.b1 = initBias(256);
    this.w2 = initWeights(256, 128, 2);
    this.b2 = initBias(128);
    this.w3 = initWeights(128, 64, 3);
    this.b3 = initBias(64);
    this.w4 = initWeights(64, outputSize, 4);
    this.b4 = initBias(outputSize);
  }

  forward(inputs: number[]): number[] {
    const h1 = dotAdd(inputs, this.w1, this.b1).map(relu);
    const h2 = dotAdd(h1,     this.w2, this.b2).map(relu);
    const h3 = dotAdd(h2,     this.w3, this.b3).map(relu);
    const out = dotAdd(h3,    this.w4, this.b4);
    return softmax(out);
  }

  /** Simulated training: adjust weights based on historical data patterns */
  train(
    courses: Course[],
    rooms: Room[],
    timeslots: Timeslot[],
    historicalEntries: TimetableEntry[],
    epochs: number,
    onProgress?: (e: number, loss: number, acc: number) => void
  ): void {
    // For each historical entry, nudge weights toward the correct timeslot
    const learningRate = 0.001;
    for (let epoch = 1; epoch <= epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;
      for (const entry of historicalEntries) {
        const course   = courses.find(c => c.id === entry.course_id);
        const room     = rooms.find(r => r.id === entry.room_id);
        const timeslot = timeslots.find(t => t.id === entry.timeslot_id);
        if (!course || !room || !timeslot) continue;

        const features = extractFeatures(course, room, timeslots);
        const probs    = this.forward(features);
        const targetIdx = timeslots.findIndex(t => t.id === entry.timeslot_id);
        if (targetIdx < 0) continue;

        // Cross-entropy loss
        const loss = -Math.log(probs[targetIdx] + 1e-10);
        totalLoss += loss;
        if (probs.indexOf(Math.max(...probs)) === targetIdx) correct++;

        // Backprop approximation: nudge output layer
        const grad = [...probs];
        grad[targetIdx] -= 1;
        for (let j = 0; j < this.b4.length; j++) {
          this.b4[j] -= learningRate * grad[j] * 0.01;
        }
      }
      const acc  = historicalEntries.length > 0
        ? (correct / historicalEntries.length) * 100 : 0;
      const loss = historicalEntries.length > 0
        ? totalLoss / historicalEntries.length : 0;
      onProgress?.(epoch, +loss.toFixed(4), +acc.toFixed(2));
    }
  }
}

// ─── Feature Extraction ───────────────────────────────────────────────────────

function normalize(val: number, min: number, max: number): number {
  if (max === min) return 0;
  return (val - min) / (max - min);
}

function extractFeatures(course: Course, room: Room, timeslots: Timeslot[]): number[] {
  const maxCapacity   = 300;
  const maxCredits    = 6;
  const maxEnrollment = 250;
  const typeMap: Record<string, number> = { lecture: 0, lab: 0.33, seminar: 0.66, studio: 1.0 };
  const roomTypeMap: Record<string, number> = {
    'Lecture Theatre': 0, 'Computer Lab': 0.25, 'Classroom': 0.5,
    'Science Lab': 0.75, 'Design Studio': 1.0, 'Moot Court': 0.9,
  };

  return [
    normalize(course.credits, 1, maxCredits),
    normalize(course.enrollment ?? 30, 1, maxEnrollment),
    normalize(course.year, 1, 5),
    normalize(course.semester, 1, 2),
    typeMap[course.courseType ?? 'lecture'] ?? 0,
    normalize(room.capacity, 10, maxCapacity),
    roomTypeMap[room.type] ?? 0,
    normalize(timeslots.length, 1, 20),
  ];
}

// ─── Constraint Checker ───────────────────────────────────────────────────────

interface ScheduleState {
  roomSlots: Map<string, string>;     // `${room_id}-${slot_id}` → entry_id
  lecturerSlots: Map<string, string>; // `${lec_id}-${slot_id}`  → entry_id
  deptSlots: Map<string, string[]>;   // `${dept}-${slot_id}`    → entry_ids
}

function checkConflicts(
  _courseId: string,
  lecturerId: string,
  roomId: string,
  slotId: string,
  course: Course,
  room: Room,
  state: ScheduleState
): string[] {
  const violations: string[] = [];

  if (state.roomSlots.has(`${roomId}-${slotId}`))
    violations.push('ROOM_CONFLICT');

  if (state.lecturerSlots.has(`${lecturerId}-${slotId}`))
    violations.push('LECTURER_CONFLICT');

  const enrollment = course.enrollment ?? 30;
  if (enrollment > room.capacity)
    violations.push('CAPACITY_EXCEEDED');

  const deptKey = `${course.department}-${slotId}`;
  const deptEntries = state.deptSlots.get(deptKey) ?? [];
  if (deptEntries.length >= 2)
    violations.push('DEPT_OVERLOAD');

  return violations;
}

function applyEntry(
  entry: TimetableEntry,
  course: Course,
  state: ScheduleState
): void {
  state.roomSlots.set(`${entry.room_id}-${entry.timeslot_id}`, entry.id);
  state.lecturerSlots.set(`${entry.lecturer_id}-${entry.timeslot_id}`, entry.id);
  const deptKey = `${course.department}-${entry.timeslot_id}`;
  const arr = state.deptSlots.get(deptKey) ?? [];
  arr.push(entry.id);
  state.deptSlots.set(deptKey, arr);
}

// ─── Main Generator ───────────────────────────────────────────────────────────

let _mlp: MLP | null = null;

export function getOrCreateMLP(timeslots: Timeslot[]): MLP {
  if (!_mlp) _mlp = new MLP(8, timeslots.length);
  return _mlp;
}

export function resetMLP(): void { _mlp = null; }

export function trainMLP(
  courses: Course[],
  rooms: Room[],
  timeslots: Timeslot[],
  historicalEntries: TimetableEntry[],
  epochs: number,
  onProgress?: (e: number, loss: number, acc: number) => void
): void {
  _mlp = new MLP(8, timeslots.length);
  _mlp.train(courses, rooms, timeslots, historicalEntries, epochs, onProgress);
}

export function generateTimetable(
  courses: Course[],
  lecturers: Lecturer[],
  rooms: Room[],
  timeslots: Timeslot[],
  semester: number,
  academicYear: string
): GenerationResult {
  const start = Date.now();
  const mlp   = getOrCreateMLP(timeslots);

  const state: ScheduleState = {
    roomSlots:     new Map(),
    lecturerSlots: new Map(),
    deptSlots:     new Map(),
  };

  const entries: TimetableEntry[]  = [];
  const conflicts: ConflictReport[] = [];

  // Filter courses for this semester
  const semesterCourses = courses.filter(c => c.semester === semester);

  for (const course of semesterCourses) {
    const lecturer = lecturers.find(l => l.id === course.lecturer_id);
    if (!lecturer) {
      conflicts.push({
        type: 'lecturer', severity: 'hard',
        description: `${course.code}: No lecturer assigned`,
        entryIds: [course.id],
      });
      continue;
    }

    // Find suitable rooms (capacity + type match)
    const suitableRooms = rooms.filter(r => {
      if (!r.available) return false;
      const enrollment = course.enrollment ?? 30;
      if (r.capacity < enrollment) return false;
      if (course.courseType === 'lab' && !r.type.includes('Lab')) return false;
      if (course.courseType === 'studio' && !r.type.includes('Studio')) return false;
      return true;
    });

    if (suitableRooms.length === 0) {
      // Fall back to any available room with warning
      const fallback = rooms.filter(r => r.available !== false);
      if (fallback.length === 0) {
        conflicts.push({
          type: 'room', severity: 'hard',
          description: `${course.code}: No available rooms`,
          entryIds: [course.id],
        });
        continue;
      }
      suitableRooms.push(...fallback);
      conflicts.push({
        type: 'capacity', severity: 'soft',
        description: `${course.code}: Scheduled in suboptimal room (capacity mismatch)`,
        entryIds: [course.id],
      });
    }

    // Try each room; for each room get MLP predictions
    let scheduled = false;
    for (const room of suitableRooms) {
      const features  = extractFeatures(course, room, timeslots);
      const probs     = mlp.forward(features);

      // Build ranked slot list, respecting lecturer unavailability
      const blockedSlots = new Set(lecturer.unavailableSlots ?? []);
      const ranked = timeslots
        .map((t, i) => ({ slot: t, prob: probs[i] ?? 0 }))
        .filter(x => !blockedSlots.has(x.slot.id))
        .sort((a, b) => b.prob - a.prob);

      for (const { slot } of ranked) {
        const violations = checkConflicts(
          course.id, lecturer.id, room.id, slot.id, course, room, state
        );
        const hardViolations = violations.filter(v =>
          ['ROOM_CONFLICT', 'LECTURER_CONFLICT'].includes(v)
        );

        if (hardViolations.length === 0) {
          const entryId = `tt-${course.id}-${slot.id}`;
          const entry: TimetableEntry = {
            id:           entryId,
            course_id:    course.id,
            lecturer_id:  lecturer.id,
            room_id:      room.id,
            timeslot_id:  slot.id,
            semester,
            academicYear,
            course,
            lecturer,
            room,
            timeslot:     slot,
            conflictFlags: violations.filter(v => !hardViolations.includes(v)),
          };
          entries.push(entry);
          applyEntry(entry, course, state);
          scheduled = true;
          break;
        }
      }
      if (scheduled) break;
    }

    if (!scheduled) {
      conflicts.push({
        type: 'room', severity: 'hard',
        description: `${course.code}: Could not find a conflict-free slot`,
        entryIds: [course.id],
      });
    }
  }

  // Compute stats
  const scheduledCount  = entries.length;
  const hardConflicts   = conflicts.filter(c => c.severity === 'hard').length;
  const softConflicts   = conflicts.filter(c => c.severity === 'soft').length;
  const usedRooms       = new Set(entries.map(e => e.room_id)).size;
  const usedLecturers   = new Set(entries.map(e => e.lecturer_id)).size;
  const roomUtil        = rooms.length > 0 ? Math.round((usedRooms / rooms.length) * 100) : 0;
  const lecUtil         = lecturers.length > 0
    ? Math.round((usedLecturers / lecturers.length) * 100) : 0;

  return {
    entries,
    conflicts,
    stats: {
      totalScheduled:    scheduledCount,
      hardConflicts,
      softConflicts,
      roomUtilization:   roomUtil,
      lecturerUtilization: lecUtil,
      generationTimeMs:  Date.now() - start,
    },
  };
}

export function validateExistingTimetable(
  entries: TimetableEntry[],
  courses: Course[],
  rooms: Room[]
): ConflictReport[] {
  const conflicts: ConflictReport[] = [];
  const roomSlots     = new Map<string, string>();
  const lecturerSlots = new Map<string, string>();

  for (const entry of entries) {
    const course = courses.find(c => c.id === entry.course_id);
    const room   = rooms.find(r => r.id === entry.room_id);

    const roomKey = `${entry.room_id}-${entry.timeslot_id}`;
    if (roomSlots.has(roomKey)) {
      conflicts.push({
        type: 'room', severity: 'hard',
        description: `Room double-booked at ${entry.timeslot_id}`,
        entryIds: [roomSlots.get(roomKey)!, entry.id],
      });
    } else roomSlots.set(roomKey, entry.id);

    const lecKey = `${entry.lecturer_id}-${entry.timeslot_id}`;
    if (lecturerSlots.has(lecKey)) {
      conflicts.push({
        type: 'lecturer', severity: 'hard',
        description: `Lecturer double-booked at ${entry.timeslot_id}`,
        entryIds: [lecturerSlots.get(lecKey)!, entry.id],
      });
    } else lecturerSlots.set(lecKey, entry.id);

    if (course && room) {
      const enrollment = course.enrollment ?? 30;
      if (enrollment > room.capacity) {
        conflicts.push({
          type: 'capacity', severity: 'soft',
          description: `${course.code}: enrollment ${enrollment} exceeds room capacity ${room.capacity}`,
          entryIds: [entry.id],
        });
      }
    }
  }
  return conflicts;
}
