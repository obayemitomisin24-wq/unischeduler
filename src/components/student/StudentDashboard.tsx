import { useState } from 'react';
import { GraduationCap, Calendar, Clock, BookOpen, Bell, Building2 } from 'lucide-react';
import { User } from '../../types';
import { MOCK_TIMETABLE, MOCK_COURSES, MOCK_TIMESLOTS, MOCK_ROOMS, MOCK_LECTURERS, MOCK_CHANGE_REQUESTS, MOCK_NOTIFICATIONS, getActiveSession } from '../../lib/mockData';
import { getFacultyByDept, getDeptsByFaculty } from '../../lib/faculties';

interface Props { user: User; }

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function StudentDashboard({ user }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const faculty = getFacultyByDept(user.department ?? '');
  const facultyDepts = faculty ? getDeptsByFaculty(faculty.id) : [];
  const session = getActiveSession();

  const deptCourses = MOCK_COURSES.filter(c => c.department === user.department && c.semester === session.semester);
  const facultyCourses = MOCK_COURSES.filter(c => c.faculty === faculty?.name);

  const myEntries = MOCK_TIMETABLE.filter(t =>
    deptCourses.some(c => c.id === t.course_id) && t.semester === session.semester
  ).map(t => ({
    ...t,
    course:   MOCK_COURSES.find(c => c.id === t.course_id),
    slot:     MOCK_TIMESLOTS.find(s => s.id === t.timeslot_id),
    room:     MOCK_ROOMS.find(r => r.id === t.room_id),
    lecturer: MOCK_LECTURERS.find(l => l.id === t.lecturer_id),
  }));

  const todayDay  = new Date().toLocaleDateString('en-NG', { weekday: 'long' });
  const todayCls  = myEntries.filter(e => e.slot?.day === todayDay);
  const myReqs    = MOCK_CHANGE_REQUESTS.filter(r => r.requester_id === user.id);
  const myNotifs  = MOCK_NOTIFICATIONS.filter(n => n.user_id === user.id && !n.read);

  const filteredEntries = selectedDay === 'All'
    ? myEntries
    : myEntries.filter(e => e.slot?.day === selectedDay);

  const fc = faculty?.color ?? { bg:'bg-indigo-50', border:'border-indigo-300', text:'text-indigo-800', badge:'bg-indigo-100 text-indigo-700', header:'bg-indigo-600', dot:'bg-indigo-500' };

  const gradMap: Record<string, string> = {
    'fac-bms': 'from-red-600 to-rose-600',    'fac-eng': 'from-orange-600 to-amber-600',
    'fac-env': 'from-lime-600 to-green-600',   'fac-hum': 'from-purple-600 to-violet-600',
    'fac-law': 'from-slate-600 to-gray-700',   'fac-mgt': 'from-amber-600 to-yellow-600',
    'fac-sci': 'from-teal-600 to-cyan-600',    'fac-soc': 'from-sky-600 to-blue-600',
    'fac-cdt': 'from-indigo-600 to-blue-600',
  };
  const headerGrad = faculty ? (gradMap[faculty.id] ?? 'from-indigo-600 to-blue-600') : 'from-indigo-600 to-blue-600';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className={`bg-gradient-to-r ${headerGrad} rounded-2xl p-5 sm:p-6 text-white shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{faculty?.shortCode} · {user.faculty}</span>
              {myNotifs.length > 0 && (
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Bell className="w-3 h-3" /> {myNotifs.length} new
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
            <p className="text-white/70 text-sm mt-0.5">{user.studentId} · {user.department} · Level {user.level ?? 300}</p>
          </div>
          <div className="text-left sm:text-right text-white/80">
            <p className="text-sm">{session.year} · Semester {session.semester}</p>
            <p className="text-xl font-bold text-white">{todayCls.length} class{todayCls.length !== 1 ? 'es' : ''} today</p>
            <p className="text-xs text-white/60">{todayDay}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'My Courses',       value: deptCourses.length,     icon: <BookOpen className="w-5 h-5" />,   grad: 'from-indigo-500 to-indigo-600' },
          { label: 'Weekly Classes',   value: myEntries.length,       icon: <Calendar className="w-5 h-5" />,   grad: 'from-blue-500 to-blue-600' },
          { label: 'Faculty Depts',    value: facultyDepts.length,    icon: <Building2 className="w-5 h-5" />,  grad: 'from-teal-500 to-teal-600' },
          { label: 'My Requests',      value: myReqs.length,          icon: <Bell className="w-5 h-5" />,       grad: 'from-orange-500 to-orange-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className={`w-10 h-10 bg-gradient-to-br ${s.grad} rounded-xl flex items-center justify-center text-white mb-3 shadow`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's classes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Today's Classes</h3>
            <span className="ml-auto text-xs text-gray-400">{todayDay}</span>
          </div>
          {todayCls.length > 0 ? (
            <div className="space-y-3">
              {todayCls.map(e => (
                <div key={e.id} className={`p-4 rounded-xl border ${fc.bg} ${fc.border}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-bold text-sm ${fc.text}`}>{e.course?.code}</p>
                      <p className="text-sm text-gray-600">{e.course?.title}</p>
                      <p className="text-xs text-gray-400 mt-1">👤 {e.lecturer?.name}</p>
                      {e.room?.facilities && (
                        <p className="text-xs text-gray-400">{e.room.facilities.slice(0, 2).join(' · ')}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                      <p className="font-mono font-bold">{e.slot?.start_time}–{e.slot?.end_time}</p>
                      <p className={`font-medium mt-0.5 ${fc.text}`}>📍 {e.room?.name}</p>
                      <p className="text-gray-400">{e.room?.building}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No classes today</p>
              <p className="text-sm">Enjoy your free day!</p>
            </div>
          )}
        </div>

        {/* Weekly timetable mini view */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
          </div>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {['All', ...DAYS].map(d => (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 transition ${
                  selectedDay === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {d === 'All' ? 'All' : d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No classes{selectedDay !== 'All' ? ` on ${selectedDay}` : ''}</p>
            ) : filteredEntries.sort((a, b) => {
              const dayOrder = DAYS.indexOf(a.slot?.day ?? '') - DAYS.indexOf(b.slot?.day ?? '');
              if (dayOrder !== 0) return dayOrder;
              return (a.slot?.start_time ?? '').localeCompare(b.slot?.start_time ?? '');
            }).map(e => (
              <div key={e.id} className={`flex items-center justify-between p-3 rounded-xl border ${fc.bg} ${fc.border}`}>
                <div>
                  <span className={`text-xs font-bold ${fc.text}`}>{e.slot?.day?.slice(0,3)}</span>
                  <span className="text-xs text-gray-400 ml-2 font-mono">{e.slot?.start_time}</span>
                  <p className="text-sm font-semibold text-gray-800">{e.course?.code}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>📍 {e.room?.name}</p>
                  <p className="text-gray-400">{e.course?.credits} cr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My courses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{user.department} — Registered Courses</h3>
          {faculty && (
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border ${fc.badge} ${fc.border}`}>
              {faculty.shortCode}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deptCourses.map(course => {
            const lecturer = MOCK_LECTURERS.find(l => l.id === course.lecturer_id);
            const entry    = myEntries.find(e => e.course_id === course.id);
            return (
              <div key={course.id} className={`p-4 border rounded-xl hover:shadow-sm transition ${fc.bg} ${fc.border}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono font-bold text-sm ${fc.text}`}>{course.code}</span>
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${fc.badge}`}>{course.credits} cr</span>
                    {course.courseType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{course.courseType}</span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800">{course.title}</p>
                <p className="text-xs text-gray-400 mt-1">{lecturer?.name ?? 'TBD'}</p>
                {entry && (
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    {entry.slot?.day?.slice(0,3)} {entry.slot?.start_time} · {entry.room?.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Faculty overview */}
      {faculty && facultyDepts.length > 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Departments in {faculty.shortCode}</h3>
            <span className="ml-auto text-xs text-gray-400">{facultyCourses.length} courses total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {facultyDepts.map(d => (
              <span key={d.id} className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                d.name === user.department
                  ? `${fc.badge} ${fc.border} font-bold ring-2 ring-offset-1 ring-indigo-300`
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                {d.name === user.department ? '✓ ' : ''}{d.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
