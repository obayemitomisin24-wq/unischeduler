import { BookOpen, Users, Building, BarChart2, PieChart, AlertTriangle } from 'lucide-react';
import {
  MOCK_COURSES, MOCK_LECTURERS, MOCK_ROOMS, MOCK_TIMETABLE,
  MOCK_TIMESLOTS, getActiveSession
} from '../../lib/mockData';
import { FACULTIES } from '../../lib/faculties';
import { validateExistingTimetable } from '../../lib/scheduler';

export default function Analytics() {
  const session = getActiveSession();
  const sem = session.semester;

  const semEntries = MOCK_TIMETABLE.filter(t => t.semester === sem);
  const conflicts  = validateExistingTimetable(semEntries, MOCK_COURSES, MOCK_ROOMS);

  // Room utilisation per room
  const roomUtil = MOCK_ROOMS.map(r => ({
    name:    r.name,
    type:    r.type,
    cap:     r.capacity,
    classes: semEntries.filter(e => e.room_id === r.id).length,
    maxSlots: MOCK_TIMESLOTS.length,
  })).map(r => ({ ...r, pct: Math.round((r.classes / r.maxSlots) * 100) }))
    .sort((a,b) => b.classes - a.classes);

  // Lecturer workload
  const lecLoad = MOCK_LECTURERS.map(l => ({
    name:    l.name.split(' ').slice(-1)[0],
    full:    l.name,
    classes: semEntries.filter(e => e.lecturer_id === l.id).length,
    max:     l.maxHoursPerWeek ?? 10,
    dept:    l.department,
  })).sort((a,b) => b.classes - a.classes);

  // Courses per faculty
  const facCourses = FACULTIES.map(f => ({
    name:    f.shortCode,
    full:    f.name,
    courses: MOCK_COURSES.filter(c => c.faculty === f.name && c.semester === sem).length,
    color:   f.color,
  })).filter(f => f.courses > 0).sort((a,b) => b.courses - a.courses);

  // Day distribution
  const dayDist = ['Monday','Tuesday','Wednesday','Thursday','Friday'].map(day => ({
    day: day.slice(0,3),
    count: semEntries.filter(e => {
      const slot = MOCK_TIMESLOTS.find(t => t.id === e.timeslot_id);
      return slot?.day === day;
    }).length,
  }));
  const maxDay = Math.max(...dayDist.map(d => d.count), 1);

  const statCards = [
    { label:'Total Scheduled',   value: semEntries.length,        icon: <Calendar />,     color:'indigo' },
    { label:'Hard Conflicts',    value: conflicts.filter(c=>c.severity==='hard').length,  icon: <AlertTriangle />, color: conflicts.filter(c=>c.severity==='hard').length>0?'red':'green' },
    { label:'Room Utilisation',  value: `${roomUtil.length > 0 ? Math.round(roomUtil.filter(r=>r.classes>0).length/MOCK_ROOMS.length*100) : 0}%`, icon:<Building />, color:'teal' },
    { label:'Active Lecturers',  value: new Set(semEntries.map(e=>e.lecturer_id)).size,   icon: <Users />,         color:'purple' },
  ];

  function Calendar() { return <BookOpen className="w-6 h-6" />; }

  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600',
    red:    'from-red-500 to-red-600',
    green:  'from-green-500 to-green-600',
    teal:   'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Timetable Analytics</h2>
          <p className="text-gray-500 text-sm">{session.year} — Semester {sem}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center text-white mb-4 shadow-md`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day distribution bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Classes by Day</h3>
          </div>
          <div className="space-y-3">
            {dayDist.map(d => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{d.day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${Math.max(8, (d.count / maxDay) * 100)}%` }}>
                    <span className="text-white text-xs font-bold">{d.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses per faculty */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Courses by Faculty</h3>
          </div>
          <div className="space-y-2.5">
            {facCourses.map(f => (
              <div key={f.name} className={`flex items-center justify-between p-3 rounded-xl border ${f.color.bg} ${f.color.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${f.color.dot}`} />
                  <span className={`text-sm font-semibold ${f.color.text}`}>{f.name}</span>
                </div>
                <span className={`text-sm font-bold ${f.color.text}`}>{f.courses} course{f.courses !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room utilisation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">Room Utilisation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roomUtil.map(r => (
            <div key={r.name} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.type} · Cap: {r.cap}</p>
                </div>
                <span className={`text-sm font-bold ${r.pct >= 60 ? 'text-green-600' : r.pct >= 30 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {r.pct}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.pct >= 60 ? 'bg-green-400' : r.pct >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${r.pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{r.classes} of {r.maxSlots} slots used</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lecturer workload table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">Lecturer Workload Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="text-left py-2 px-3 font-medium">Lecturer</th>
                <th className="text-left py-2 px-3 font-medium hidden sm:table-cell">Department</th>
                <th className="text-left py-2 px-3 font-medium">Classes</th>
                <th className="text-left py-2 px-3 font-medium">Load</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lecLoad.map(l => {
                const pct  = Math.min(100, Math.round((l.classes / (l.max / 2)) * 100));
                const over = pct >= 90;
                const low  = pct < 30;
                return (
                  <tr key={l.name} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-3 font-medium text-gray-800">{l.full}</td>
                    <td className="py-3 px-3 text-gray-500 text-xs hidden sm:table-cell">{l.dept}</td>
                    <td className="py-3 px-3">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-lg font-bold">{l.classes}</span>
                    </td>
                    <td className="py-3 px-3 w-32">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${over ? 'bg-red-400' : low ? 'bg-yellow-400' : 'bg-green-400'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        over ? 'bg-red-100 text-red-700' :
                        low  ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{over ? 'Overloaded' : low ? 'Light' : 'Balanced'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
