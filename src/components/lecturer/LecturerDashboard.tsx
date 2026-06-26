import { useState } from 'react';
import { Calendar, Clock, BookOpen, Bell, Users, Send, CheckCircle } from 'lucide-react';
import { User } from '../../types';
import { MOCK_TIMETABLE, MOCK_COURSES, MOCK_TIMESLOTS, MOCK_ROOMS, MOCK_CHANGE_REQUESTS, addChangeRequest, MOCK_NOTIFICATIONS, getActiveSession } from '../../lib/mockData';

interface Props { user: User; }

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function LecturerDashboard({ user }: Props) {
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqForm, setReqForm] = useState({ timetable_id: '', requested_day: 'Monday', requested_time: '08:00 - 10:00', reason: '' });
  const [submitted, setSubmitted] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All');
  const session = getActiveSession();

  const myEntries = MOCK_TIMETABLE.filter(t => t.lecturer_id === user.id && t.semester === session.semester)
    .map(t => ({
      ...t,
      course:  MOCK_COURSES.find(c => c.id === t.course_id),
      slot:    MOCK_TIMESLOTS.find(s => s.id === t.timeslot_id),
      room:    MOCK_ROOMS.find(r => r.id === t.room_id),
    }));

  const myReqs   = MOCK_CHANGE_REQUESTS.filter(r => r.requester_id === user.id);
  const myNotifs = MOCK_NOTIFICATIONS.filter(n => n.user_id === user.id && !n.read);
  const todayDay = new Date().toLocaleDateString('en-NG', { weekday: 'long' });
  const todayCls = myEntries.filter(e => e.slot?.day === todayDay);

  const totalStudents = myEntries.reduce((sum, e) => sum + (e.course?.enrollment ?? 0), 0);
  const totalCredits  = [...new Set(myEntries.map(e => e.course_id))]
    .reduce((sum, id) => sum + (MOCK_COURSES.find(c => c.id === id)?.credits ?? 0), 0);

  const filtered = selectedDay === 'All'
    ? myEntries
    : myEntries.filter(e => e.slot?.day === selectedDay);

  const submitRequest = () => {
    const entry = myEntries.find(e => e.id === reqForm.timetable_id);
    if (!entry) return;
    addChangeRequest({
      requester_id:   user.id,
      requester_name: user.name,
      requester_role: 'lecturer',
      timetable_id:   reqForm.timetable_id,
      course_name:    `${entry.course?.code} - ${entry.course?.title}`,
      current_day:    entry.slot?.day ?? '',
      current_time:   `${entry.slot?.start_time} - ${entry.slot?.end_time}`,
      requested_day:  reqForm.requested_day,
      requested_time: reqForm.requested_time,
      reason:         reqForm.reason,
      status:         'pending',
    });
    setSubmitted(true);
    setTimeout(() => { setShowReqForm(false); setSubmitted(false); setReqForm({ timetable_id:'', requested_day:'Monday', requested_time:'08:00 - 10:00', reason:'' }); }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{user.department}</span>
              {myNotifs.length > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Bell className="w-3 h-3" />{myNotifs.length}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-purple-200 text-sm">{user.faculty}</p>
          </div>
          <div className="text-left sm:text-right text-white/80">
            <p className="text-sm">{session.year} · Sem {session.semester}</p>
            <p className="text-xl font-bold text-white">{todayCls.length} class{todayCls.length !== 1 ? 'es' : ''} today</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Classes',  value: myEntries.length,  color: 'from-purple-500 to-purple-600', icon: <Calendar className="w-5 h-5" /> },
          { label: 'Total Students',  value: totalStudents,     color: 'from-blue-500 to-blue-600',     icon: <Users className="w-5 h-5" /> },
          { label: 'Credit Hours',    value: totalCredits,      color: 'from-indigo-500 to-indigo-600', icon: <BookOpen className="w-5 h-5" /> },
          { label: 'My Requests',     value: myReqs.length,     color: 'from-orange-500 to-orange-600', icon: <Bell className="w-5 h-5" /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white mb-3 shadow`}>
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
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Today's Teaching</h3>
            <span className="ml-auto text-xs text-gray-400">{todayDay}</span>
          </div>
          {todayCls.length > 0 ? (
            <div className="space-y-3">
              {todayCls.map(e => (
                <div key={e.id} className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-purple-800">{e.course?.code}</p>
                      <p className="text-sm text-gray-700">{e.course?.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Users className="w-3 h-3 inline mr-1" />{e.course?.enrollment ?? '?'} students
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-mono font-bold text-gray-700">{e.slot?.start_time}–{e.slot?.end_time}</p>
                      <p className="text-purple-600 font-medium">📍 {e.room?.name}</p>
                      <p className="text-gray-400">Cap: {e.room?.capacity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No classes scheduled today</p>
            </div>
          )}
        </div>

        {/* Weekly schedule */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">My Teaching Schedule</h3>
          </div>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {['All', ...DAYS].map(d => (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 transition ${
                  selectedDay === d ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{d === 'All' ? 'All' : d.slice(0,3)}</button>
            ))}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.sort((a, b) => {
              const di = DAYS.indexOf(a.slot?.day ?? '') - DAYS.indexOf(b.slot?.day ?? '');
              return di !== 0 ? di : (a.slot?.start_time ?? '').localeCompare(b.slot?.start_time ?? '');
            }).map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-purple-700">{e.slot?.day?.slice(0,3)}</span>
                  <span className="text-xs text-gray-400 ml-2 font-mono">{e.slot?.start_time}</span>
                  <p className="text-sm font-semibold text-gray-800">{e.course?.code}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{e.room?.name}</p>
                  <p className="text-gray-400">{e.course?.enrollment} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change request */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Request Schedule Change</h3>
          <button onClick={() => setShowReqForm(v => !v)}
            className="ml-auto text-sm text-indigo-600 font-medium hover:text-indigo-800 transition">
            {showReqForm ? 'Cancel' : '+ New Request'}
          </button>
        </div>

        {showReqForm && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 space-y-3">
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-700">Request submitted!</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Class to Reschedule</label>
                  <select value={reqForm.timetable_id} onChange={e => setReqForm({...reqForm, timetable_id: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="">— Select a class —</option>
                    {myEntries.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.course?.code} — {e.slot?.day} {e.slot?.start_time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Preferred Day</label>
                    <select value={reqForm.requested_day} onChange={e => setReqForm({...reqForm, requested_day: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                      {DAYS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Preferred Time</label>
                    <select value={reqForm.requested_time} onChange={e => setReqForm({...reqForm, requested_time: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                      {['08:00 - 10:00','10:00 - 12:00','14:00 - 16:00'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Reason</label>
                  <textarea value={reqForm.reason} onChange={e => setReqForm({...reqForm, reason: e.target.value})}
                    rows={2} placeholder="Briefly explain why you need this change..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>
                <button onClick={submitRequest} disabled={!reqForm.timetable_id || !reqForm.reason}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                  Submit Request
                </button>
              </>
            )}
          </div>
        )}

        {/* Request history */}
        {myReqs.length > 0 && (
          <div className="space-y-2">
            {myReqs.slice(0,4).map(req => (
              <div key={req.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{req.course_name}</p>
                  <p className="text-xs text-gray-400">{req.current_day} → {req.requested_day}</p>
                  {req.admin_response && (
                    <p className="text-xs text-gray-500 mt-0.5 italic">"{req.admin_response}"</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${
                  req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                  req.status === 'approved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {req.status === 'pending' ? '⏳' : req.status === 'approved' ? '✓' : '✗'} {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
