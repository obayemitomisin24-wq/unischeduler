import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import {
  MOCK_CHANGE_REQUESTS, updateChangeRequest, addNotification
} from '../../lib/mockData';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

export default function ChangeRequestManagement() {
  const [requests, setRequests] = useState(MOCK_CHANGE_REQUESTS);
  const [filter,   setFilter]   = useState<Filter>('all');
  const [response, setResponse] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = () => setRequests([...MOCK_CHANGE_REQUESTS]);

  const handle = (id: string, status: 'approved' | 'rejected') => {
    const resp = response[id] || '';
    updateChangeRequest(id, { status, admin_response: resp });
    const req = MOCK_CHANGE_REQUESTS.find(r => r.id === id);
    if (req) {
      addNotification({
        user_id: req.requester_id,
        message: `Your change request for ${req.course_name} has been ${status}.`,
        type:    status === 'approved' ? 'success' : 'error',
        read:    false,
      });
    }
    refresh();
    setExpanded(null);
  };

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all',      label: `All (${requests.length})` },
    { key: 'pending',  label: `Pending (${requests.filter(r=>r.status==='pending').length})` },
    { key: 'approved', label: `Approved (${requests.filter(r=>r.status==='approved').length})` },
    { key: 'rejected', label: `Rejected (${requests.filter(r=>r.status==='rejected').length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Change Request Management</h2>
          <p className="text-gray-500 text-sm">Review and respond to timetable reschedule requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              filter === t.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No {filter === 'all' ? '' : filter} requests</p>
          </div>
        )}
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between p-5 cursor-pointer"
              onClick={() => setExpanded(expanded === req.id ? null : req.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800">{req.course_name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                    req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'approved' ? 'bg-green-100 text-green-700'  :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status === 'pending' && <Clock className="w-3 h-3 inline mr-0.5" />}
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {req.requester_name}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded capitalize ${
                    req.requester_role === 'lecturer' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>{req.requester_role}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="font-medium">{req.current_day} {req.current_time}</span>
                  <span className="mx-2">→</span>
                  <span className="font-medium text-indigo-600">{req.requested_day} {req.requested_time}</span>
                </p>
              </div>
              <span className="text-gray-400 text-lg ml-3">{expanded === req.id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded details */}
            {expanded === req.id && (
              <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason for Request</p>
                  <p className="text-sm text-gray-600">{req.reason}</p>
                </div>

                {req.admin_response && (
                  <div className={`rounded-xl p-4 ${
                    req.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-sm font-medium mb-1">Admin Response</p>
                    <p className="text-sm">{req.admin_response}</p>
                  </div>
                )}

                {req.status === 'pending' && (
                  <div className="space-y-3">
                    <textarea
                      value={response[req.id] || ''}
                      onChange={e => setResponse(prev => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder="Optional response message to the requester..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-300 outline-none"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => handle(req.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => handle(req.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 text-right">
                  Submitted {new Date(req.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
