import { useState } from 'react';
import { Eye, Users, GraduationCap, Shield, ChevronDown } from 'lucide-react';
import { MOCK_USERS } from '../../lib/mockData';
import TimetableViewer from '../shared/TimetableViewer';
import StudentDashboard from '../student/StudentDashboard';
import LecturerDashboard from '../lecturer/LecturerDashboard';
import { User } from '../../types';

const DEMO_STUDENTS = MOCK_USERS.filter(u => u.role === 'student');
const DEMO_LECTURERS = MOCK_USERS.filter(u => u.role === 'lecturer');

export default function RolePreview() {
  const [previewRole, setPreviewRole] = useState<'student' | 'lecturer' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [previewTab, setPreviewTab] = useState<'dashboard' | 'timetable'>('dashboard');

  const handleRoleSelect = (role: 'student' | 'lecturer') => {
    setPreviewRole(role);
    const users = role === 'student' ? DEMO_STUDENTS : DEMO_LECTURERS;
    setSelectedUser(users[0] ?? null);
    setPreviewTab('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
          <Eye className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Role Preview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            See the system exactly as students and lecturers see it
          </p>
        </div>
      </div>

      {/* Role selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleRoleSelect('student')}
          className={`p-5 rounded-2xl border-2 text-left transition hover:shadow-md ${
            previewRole === 'student'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300'
          }`}>
          <GraduationCap className={`w-8 h-8 mb-3 ${previewRole === 'student' ? 'text-blue-600' : 'text-gray-400'}`} />
          <p className="font-bold text-gray-800 dark:text-white">Student View</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            See the personal dashboard, department timetable, course list and weekly schedule
          </p>
          {previewRole === 'student' && (
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Active Preview</span>
          )}
        </button>

        <button
          onClick={() => handleRoleSelect('lecturer')}
          className={`p-5 rounded-2xl border-2 text-left transition hover:shadow-md ${
            previewRole === 'lecturer'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300'
          }`}>
          <Users className={`w-8 h-8 mb-3 ${previewRole === 'lecturer' ? 'text-purple-600' : 'text-gray-400'}`} />
          <p className="font-bold text-gray-800 dark:text-white">Lecturer View</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            See the teaching dashboard, personal schedule, class counts and change request form
          </p>
          {previewRole === 'lecturer' && (
            <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Active Preview</span>
          )}
        </button>
      </div>

      {/* User picker + preview */}
      {previewRole && selectedUser && (
        <>
          {/* User picker */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Previewing as:</span>
              </div>
              <div className="relative">
                <select
                  value={selectedUser.id}
                  onChange={e => {
                    const users = previewRole === 'student' ? DEMO_STUDENTS : DEMO_LECTURERS;
                    setSelectedUser(users.find(u => u.id === e.target.value) ?? users[0]);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  {(previewRole === 'student' ? DEMO_STUDENTS : DEMO_LECTURERS).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.department}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Tab switcher */}
              <div className="flex gap-2 ml-auto">
                {(['dashboard', 'timetable'] as const).map(t => (
                  <button key={t} onClick={() => setPreviewTab(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize ${
                      previewTab === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Identity pill */}
            <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                previewRole === 'student' ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedUser.name}</p>
                <p className="text-xs text-gray-400">
                  {selectedUser.role === 'student' ? selectedUser.studentId : selectedUser.lecturerId} · {selectedUser.department}
                </p>
              </div>
              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                previewRole === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>{selectedUser.role}</span>
            </div>
          </div>

          {/* Preview banner */}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-700 dark:text-amber-300">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Admin preview mode — actions taken here are real and will affect the system</span>
          </div>

          {/* Rendered preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            {previewTab === 'timetable'
              ? <TimetableViewer user={selectedUser} />
              : previewRole === 'student'
                ? <StudentDashboard user={selectedUser} />
                : <LecturerDashboard user={selectedUser} />
            }
          </div>
        </>
      )}

      {!previewRole && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Select a role above to begin previewing</p>
        </div>
      )}
    </div>
  );
}
