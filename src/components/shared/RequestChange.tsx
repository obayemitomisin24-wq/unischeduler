import { useState } from 'react';
import { RefreshCw, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { User } from '../../types';
import { MOCK_CHANGE_REQUESTS, MOCK_TIMETABLE, MOCK_COURSES, MOCK_TIMESLOTS, addChangeRequest } from '../../lib/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00'];

interface Props { user: User; }

export default function RequestChange({ user }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    timetable_id: '',
    requested_day: 'Monday',
    requested_time: '08:00 - 10:00',
    reason: '',
  });

  // Get timetable entries for this user
  const myEntries = MOCK_TIMETABLE.filter(t =>
    user.role === 'lecturer' ? t.lecturer_id === user.id : true
  ).map(t => {
    const course = MOCK_COURSES.find(c => c.id === t.course_id);
    const slot = MOCK_TIMESLOTS.find(s => s.id === t.timeslot_id);
    return {
      ...t,
      course,
      slot,
      label: `${course?.code} – ${course?.title} (${slot?.day} ${slot?.start_time}–${slot?.end_time})`,
    };
  });

  const selectedEntry = myEntries.find(e => e.id === form.timetable_id);
  const myRequests = MOCK_CHANGE_REQUESTS.filter(r => r.requester_id === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;
    addChangeRequest({
      requester_id: user.id,
      requester_name: user.name,
      requester_role: user.role,
      timetable_id: form.timetable_id,
      course_name: `${selectedEntry.course?.code} - ${selectedEntry.course?.title}`,
      current_day: selectedEntry.slot?.day || '',
      current_time: `${selectedEntry.slot?.start_time} - ${selectedEntry.slot?.end_time}`,
      requested_day: form.requested_day,
      requested_time: form.requested_time,
      reason: form.reason,
      status: 'pending',
    });
    setSubmitted(true);
    setForm({ timetable_id: '', requested_day: 'Monday', requested_time: '08:00 - 10:00', reason: '' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Request Timetable Change</h2>
          <p className="text-gray-500 text-sm">Submit a request to reschedule a class</p>
        </div>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-semibold">Request submitted successfully!</p>
            <p className="text-green-600 text-sm">The admin will review and respond to your request.</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="ml-auto text-green-500 hover:text-green-700 text-sm font-medium">
            New Request
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-5">Submit New Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class to Reschedule *</label>
            <select
              required
              value={form.timetable_id}
              onChange={e => setForm({ ...form, timetable_id: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">— Select a class —</option>
              {myEntries.map(e => (
                <option key={e.id} value={e.id}>{e.label}</option>
              ))}
            </select>
          </div>

          {selectedEntry && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Current Schedule</p>
              <p className="font-medium text-gray-800">{selectedEntry.course?.code} – {selectedEntry.course?.title}</p>
              <p className="text-sm text-gray-600">{selectedEntry.slot?.day}, {selectedEntry.slot?.start_time} – {selectedEntry.slot?.end_time}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Day *</label>
              <select
                value={form.requested_day}
                onChange={e => setForm({ ...form, requested_day: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
              <select
                value={form.requested_time}
                onChange={e => setForm({ ...form, requested_time: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change *</label>
            <textarea
              required
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              rows={4}
              placeholder="Please explain why you need this timetable change..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!form.timetable_id || !form.reason}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition"
          >
            <Send className="w-4 h-4" /> Submit Change Request
          </button>
        </form>
      </div>

      {/* My previous requests */}
      {myRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">My Previous Requests</h3>
          <div className="space-y-3">
            {myRequests.map(req => (
              <div key={req.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{req.course_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {req.current_day} → {req.requested_day} · {new Date(req.created_at).toLocaleDateString('en-NG')}
                    </p>
                    {req.admin_response && (
                      <p className="text-xs text-blue-600 mt-1 italic">Admin: "{req.admin_response}"</p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize flex items-center gap-1 whitespace-nowrap ${
                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status === 'pending' && <Clock className="w-3 h-3" />}
                    {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                    {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
