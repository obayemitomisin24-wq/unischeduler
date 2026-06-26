import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { MOCK_CHANGE_REQUESTS, updateChangeRequest, addNotification } from '../../lib/mockData';
import { ChangeRequest } from '../../types';

export default function ChangeRequests() {
  const [requests, setRequests] = useState<ChangeRequest[]>([...MOCK_CHANGE_REQUESTS]);
  const [filter, setFilter]     = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [response, setResponse] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const decide = (id: string, status: 'approved' | 'rejected') => {
    const note = response[id] ?? '';
    updateChangeRequest(id, { status, admin_response: note });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, admin_response: note } : r));

    // Notify requester
    const req = requests.find(r => r.id === id);
    if (req) {
      addNotification({
        user_id: req.requester_id,
        message: `Your change request for "${req.course_name}" has been ${status}.`,
        type:    status === 'approved' ? 'success' : 'error',
        read:    false,
      });
    }
    setExpanded(null);
  };

  const roleIcon = (role: string) => role === 'lecturer' ? '👩‍🏫' : '🎓';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Schedule Change Requests</h2>
          <p className="text-gray-500 text-sm">{counts.pending} pending review</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all','pending','approved','rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition ${
              filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${filter === f ? 'bg-white/20' : 'bg-gray-100'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Request cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No {filter !== 'all' ? filter : ''} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm">{roleIcon(req.requester_role)}</span>
                      <span className="font-semibold text-gray-800">{req.requester_name}</span>
                      <span className="text-xs text-gray-400 capitalize">({req.requester_role})</span>
                    </div>
                    <p className="font-bold text-gray-900">{req.course_name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 flex-wrap">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-xs">{req.current_day} {req.current_time}</span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg text-xs font-medium">{req.requested_day} {req.requested_time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 italic">"{req.reason}"</p>
                    {req.admin_response && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Response:</span> {req.admin_response}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                      req.status === 'approved' ? 'bg-green-100 text-green-700'  :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status === 'pending' ? <Clock className="w-3 h-3 inline mr-1" /> : null}
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</span>
                    {req.status === 'pending' && (
                      <button onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                        className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition">
                        <MessageSquare className="w-3 h-3" />
                        {expanded === req.id ? 'Close' : 'Respond'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Response panel */}
                {expanded === req.id && req.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <textarea
                      value={response[req.id] ?? ''}
                      onChange={e => setResponse(prev => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder="Optional note to requester..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-3"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => decide(req.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => decide(req.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
