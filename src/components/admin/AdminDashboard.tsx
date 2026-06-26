import { useState } from 'react';
import { BookOpen, Users, Building, Calendar, TrendingUp, CheckCircle, AlertCircle, RefreshCw, Bell, BarChart2, Clock } from 'lucide-react';
import {
  MOCK_COURSES, MOCK_LECTURERS, MOCK_ROOMS, MOCK_TIMETABLE,
  MOCK_CHANGE_REQUESTS, MOCK_NOTIFICATIONS, getActiveSession,
  markNotificationRead
} from '../../lib/mockData';
import { validateExistingTimetable } from '../../lib/scheduler';

export default function AdminDashboard() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS.filter(n => n.user_id === 'admin-001'));
  const session = getActiveSession();

  const pending    = MOCK_CHANGE_REQUESTS.filter(r => r.status === 'pending').length;
  const conflicts  = validateExistingTimetable(MOCK_TIMETABLE, MOCK_COURSES, MOCK_ROOMS);
  const hardConf   = conflicts.filter(c => c.severity === 'hard').length;
  const unread     = notifications.filter(n => !n.read).length;

  const semCourses = MOCK_COURSES.filter(c => c.semester === session.semester);
  const roomUtil   = Math.round((new Set(MOCK_TIMETABLE.filter(t=>t.semester===session.semester).map(t=>t.room_id)).size / MOCK_ROOMS.length) * 100);

  const stats = [
    { label: 'Courses (Active Sem)', value: semCourses.length,       icon: <BookOpen className="w-6 h-6" />,   color: 'blue',   sub: `${MOCK_COURSES.length} total` },
    { label: 'Active Lecturers',     value: MOCK_LECTURERS.length,    icon: <Users className="w-6 h-6" />,      color: 'purple', sub: 'across all faculties' },
    { label: 'Rooms Available',      value: MOCK_ROOMS.filter(r=>r.available).length, icon: <Building className="w-6 h-6" />, color: 'amber', sub: `${roomUtil}% utilised` },
    { label: 'Scheduled Classes',    value: MOCK_TIMETABLE.filter(t=>t.semester===session.semester).length, icon: <Calendar className="w-6 h-6" />, color: 'green', sub: `Sem ${session.semester} · ${session.year}` },
  ];

  const colorMap: Record<string, string> = {
    blue:   'from-blue-500 to-blue-600 shadow-blue-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    amber:  'from-amber-500 to-amber-600 shadow-amber-200',
    green:  'from-green-500 to-green-600 shadow-green-200',
  };

  // Workload per lecturer
  const lecturerLoad = MOCK_LECTURERS.map(l => ({
    name:    l.name.split(' ').slice(-1)[0],
    classes: MOCK_TIMETABLE.filter(t => t.lecturer_id === l.id && t.semester === session.semester).length,
    max:     l.maxHoursPerWeek ?? 10,
  })).sort((a, b) => b.classes - a.classes).slice(0, 6);

  const dismiss = (id: string) => {
    markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const typeColor: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-1">Admin Control Panel</h2>
            <p className="text-blue-100">University Timetable Scheduling System</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-blue-200 text-sm">{session.year} · Semester {session.semester}</p>
            <p className="text-lg font-bold">{session.startDate} → {session.endDate}</p>
            {unread > 0 && (
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-1">
                <Bell className="w-3 h-3" /> {unread} new notification{unread > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center text-white mb-4 shadow-lg`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm font-medium mt-1">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System health */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">System Health</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'MLP Neural Network',    status: 'Operational',       ok: true },
              { label: 'Constraint Validator',  status: 'Active',            ok: true },
              { label: 'Hard Conflicts',        status: hardConf === 0 ? 'None detected' : `${hardConf} found`, ok: hardConf === 0 },
              { label: 'Pending Requests',      status: pending === 0 ? 'All reviewed' : `${pending} awaiting`, ok: pending === 0 },
              { label: 'Room Utilisation',      status: `${roomUtil}%`,      ok: roomUtil >= 50 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${
                  item.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lecturer workload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Lecturer Workload</h3>
          </div>
          <div className="space-y-3">
            {lecturerLoad.map(l => {
              const pct = Math.min(100, Math.round((l.classes / (l.max / 2)) * 100));
              const over = pct >= 90;
              return (
                <div key={l.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{l.name}</span>
                    <span className={`font-bold text-xs ${over ? 'text-red-600' : 'text-indigo-600'}`}>
                      {l.classes} classes
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${over ? 'bg-red-400' : 'bg-indigo-400'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {unread > 0 && (
              <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">{unread}</span>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">No notifications</p>
            )}
            {notifications.map(n => (
              <div key={n.id} className={`p-3 rounded-xl border text-sm flex items-start justify-between gap-2 ${typeColor[n.type]} ${n.read ? 'opacity-60' : ''}`}>
                <p className="flex-1">{n.message}</p>
                {!n.read && (
                  <button onClick={() => dismiss(n.id)} className="text-xs underline whitespace-nowrap">Mark read</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent change requests */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Change Requests</h3>
          {pending > 0 && (
            <span className="ml-auto bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">
              {pending} pending
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: '600px' }}>
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="text-left py-2 px-3 font-medium">Course</th>
                <th className="text-left py-2 px-3 font-medium">Requester</th>
                <th className="text-left py-2 px-3 font-medium">Change</th>
                <th className="text-left py-2 px-3 font-medium">Date</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CHANGE_REQUESTS.slice(0, 5).map(req => (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-3 font-medium text-gray-800">{req.course_name}</td>
                  <td className="py-3 px-3 text-gray-500">{req.requester_name}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{req.current_day} → {req.requested_day}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(req.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                      req.status === 'approved' ? 'bg-green-100 text-green-700'  :
                      'bg-red-100 text-red-700'
                    }`}>{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
