import { useState, useMemo } from 'react';
import { Calendar, Download, Filter, AlertTriangle } from 'lucide-react';
import { getTimetableWithDetails, MOCK_TIMESLOTS, getActiveSession, MOCK_COURSES, MOCK_ROOMS } from '../../lib/mockData';
import { validateExistingTimetable } from '../../lib/scheduler';
import { FACULTIES, getFacultyByDept } from '../../lib/faculties';
import { TimetableEntry, User } from '../../types';

interface Props { user: User; }

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const TIME_SLOTS = ['08:00–10:00','10:00–12:00','12:00–14:00','14:00–16:00'];

export default function TimetableViewer({ user }: Props) {
  const [selectedDay,     setSelectedDay]     = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [showConflicts,   setShowConflicts]   = useState(false);
  const session = getActiveSession();

  const allEntries = getTimetableWithDetails().filter(e => e.semester === selectedSemester);
  const conflicts  = validateExistingTimetable(allEntries, MOCK_COURSES, MOCK_ROOMS);

  let entries: TimetableEntry[] = allEntries;
  if (user.role === 'lecturer') {
    entries = allEntries.filter(e => e.lecturer_id === user.id);
  } else if (user.role === 'student' && user.department) {
    entries = allEntries.filter(e => e.course?.department === user.department);
  } else if (selectedFaculty !== 'All' && user.role === 'admin') {
    entries = allEntries.filter(e => e.course?.faculty === selectedFaculty);
  }

  const filteredDays = selectedDay === 'All' ? DAYS : [selectedDay];

  const getCell = (day: string, time: string) => {
    const [st, et] = time.split('–');
    const slot = MOCK_TIMESLOTS.find(s => s.day === day && s.start_time === st && s.end_time === et);
    if (!slot) return [];
    return entries.filter(e => e.timeslot_id === slot.id);
  };

  const getCellColor = (entry: TimetableEntry) => {
    const fac = entry.course?.faculty
      ? FACULTIES.find(f => f.name === entry.course!.faculty)
      : undefined;
    if (!fac) return { bg:'bg-gray-50', border:'border-gray-200', text:'text-gray-700', badge:'bg-gray-100 text-gray-600' };
    return fac.color;
  };

  const conflictIds = new Set(conflicts.flatMap(c => c.entryIds));

  const summary = useMemo(() => {
    const used = new Set(entries.map(e => e.room_id));
    const lecs = new Set(entries.map(e => e.lecturer_id));
    return {
      classes: entries.length,
      courses: new Set(entries.map(e => e.course_id)).size,
      rooms:   used.size,
      lecturers: lecs.size,
    };
  }, [entries]);

  const exportCSV = () => {
    const rows = [['Course','Code','Lecturer','Room','Day','Start','End','Faculty']];
    entries.forEach(e => rows.push([
      e.course?.title ?? '', e.course?.code ?? '', e.lecturer?.name ?? '',
      e.room?.name ?? '', e.timeslot?.day ?? '', e.timeslot?.start_time ?? '',
      e.timeslot?.end_time ?? '', e.course?.faculty ?? ''
    ]));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `timetable-sem${selectedSemester}-${session.year}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {user.role === 'lecturer' ? 'My Teaching Schedule' :
               user.role === 'student'  ? `${user.department} Timetable` :
               'University Timetable'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">{session.year} — Semester {selectedSemester}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {conflicts.length > 0 && (
            <button onClick={() => setShowConflicts(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition">
              <AlertTriangle className="w-4 h-4" />
              {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Conflict panel */}
      {showConflicts && conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
          <p className="font-semibold text-red-800 text-sm">Detected Conflicts</p>
          {conflicts.map((c, i) => (
            <div key={i} className={`text-xs p-2 rounded-lg border ${c.severity === 'hard' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-yellow-100 border-yellow-300 text-yellow-700'}`}>
              <span className="font-semibold capitalize">[{c.severity}] {c.type}: </span>{c.description}
            </div>
          ))}
        </div>
      )}

      {/* Faculty legend */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Faculty Colour Key</p>
        <div className="flex flex-wrap gap-2">
          {FACULTIES.map(fac => (
            <span key={fac.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${fac.color.bg} ${fac.color.border} ${fac.color.text}`}>
              <span className={`w-2 h-2 rounded-full ${fac.color.dot}`} />
              {fac.shortCode}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Semester */}
        <div className="flex gap-2">
          {[1,2].map(s => (
            <button key={s} onClick={() => setSelectedSemester(s)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex-shrink-0 border ${
                selectedSemester === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>Sem {s}</button>
          ))}
        </div>
        {/* Day filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {['All', ...DAYS].map(day => (
            <button key={day} onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex-shrink-0 ${
                selectedDay === day ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              <span className="sm:hidden">{day === 'All' ? 'All' : day.slice(0,3)}</span>
              <span className="hidden sm:inline">{day}</span>
            </button>
          ))}
        </div>
        {user.role === 'admin' && (
          <select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white focus:ring-2 focus:ring-indigo-300 outline-none">
            <option value="All">All Faculties</option>
            {FACULTIES.map(f => <option key={f.id} value={f.name}>{f.shortCode} — {f.name}</option>)}
          </select>
        )}
      </div>

      {/* Student faculty badge */}
      {user.role === 'student' && user.faculty && (() => {
        const fac = getFacultyByDept(user.department ?? '');
        return fac ? (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border ${fac.color.bg} ${fac.color.border} ${fac.color.text}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${fac.color.dot}`} />
            {fac.name}
          </div>
        ) : null;
      })()}

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: selectedDay === 'All' ? '700px' : '340px' }}>
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <th className="text-left py-3 px-3 font-semibold w-24 whitespace-nowrap">Time</th>
                {filteredDays.map(day => (
                  <th key={day} className="text-center py-3 px-2 font-semibold whitespace-nowrap">
                    <span className="sm:hidden">{day.slice(0,3)}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(time => (
                <tr key={time} className="border-b border-gray-50">
                  <td className="py-2 px-3 font-mono text-gray-500 font-medium whitespace-nowrap bg-gray-50 border-r border-gray-100">
                    <span className="sm:hidden">{time.split('–')[0]}</span>
                    <span className="hidden sm:inline">{time}</span>
                  </td>
                  {filteredDays.map(day => {
                    const cellEntries = getCell(day, time);
                    return (
                      <td key={day} className="py-2 px-1 sm:px-2 align-top" style={{ minWidth: selectedDay === 'All' ? '130px' : '200px' }}>
                        {cellEntries.length > 0 ? (
                          <div className="space-y-1">
                            {cellEntries.map(entry => {
                              const fc = getCellColor(entry);
                              const fac = FACULTIES.find(f => f.name === entry.course?.faculty);
                              const hasConflict = conflictIds.has(entry.id);
                              return (
                                <div key={entry.id}
                                  className={`rounded-xl border p-1.5 sm:p-2 ${fc.bg} ${hasConflict ? 'ring-2 ring-red-400' : fc.border}`}>
                                  {fac && <span className={`inline-block text-[10px] font-bold px-1 rounded mb-0.5 ${fac.color.badge}`}>{fac.shortCode}</span>}
                                  {hasConflict && <span className="inline-block text-[10px] font-bold px-1 rounded mb-0.5 bg-red-100 text-red-700 ml-1">⚠</span>}
                                  <p className={`font-bold text-xs leading-tight ${fc.text}`}>{entry.course?.code}</p>
                                  <p className="text-xs leading-tight opacity-80 truncate hidden sm:block">{entry.course?.title}</p>
                                  <p className="text-xs opacity-70 mt-0.5">{entry.room?.name}</p>
                                  {user.role !== 'lecturer' && (
                                    <p className="text-xs opacity-60 truncate hidden sm:block">{entry.lecturer?.name}</p>
                                  )}
                                  {entry.course?.enrollment && (
                                    <p className="text-[10px] opacity-50">{entry.course.enrollment} students</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-12 flex items-center justify-center text-gray-200">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-4 sm:p-5 border border-indigo-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Classes', value: summary.classes },
            { label: 'Courses', value: summary.courses },
            { label: 'Rooms',   value: summary.rooms   },
            { label: 'Conflicts', value: conflicts.length, alert: conflicts.length > 0 },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-bold ${s.alert ? 'text-red-600' : 'text-indigo-700'}`}>{s.value}</p>
              <p className="text-xs text-indigo-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
