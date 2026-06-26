import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap, ChevronDown, GraduationCap, Users, Shield } from 'lucide-react';
import { User } from '../types';
import { MOCK_USERS, USER_CREDENTIALS } from '../lib/mockData';

interface Props { onLogin: (user: User) => void; }

const DEMO_STUDENTS = [
  { label: 'Computer Science (CDT)',   email: 'a.okonkwo@student.university.edu' },
  { label: 'Mathematics (SCI)',        email: 'c.eze@student.university.edu' },
  { label: 'Biochemistry (BMS)',       email: 'b.okafor@student.university.edu' },
  { label: 'Civil Engineering (ENG)',  email: 's.adeyemi@student.university.edu' },
  { label: 'Accounting (MGT)',         email: 't.babatunde@student.university.edu' },
  { label: 'Law (LAW)',                email: 'i.obi@student.university.edu' },
  { label: 'Economics (SOC)',          email: 'n.chukwu@student.university.edu' },
  { label: 'Architecture (ENV)',       email: 'b.alabi@student.university.edu' },
  { label: 'English Language (HUM)',   email: 'c.nnaji@student.university.edu' },
  { label: 'Cybersecurity (CDT)',      email: 'e.okafor@student.university.edu' },
];

const DEMO_LECTURERS = [
  { label: 'Prof. Adeyemi (CDT)',  email: 'n.adeyemi@university.edu' },
  { label: 'Dr. Nwosu (SCI)',      email: 'e.nwosu@university.edu' },
  { label: 'Dr. Balogun (BMS)',    email: 'f.balogun@university.edu' },
  { label: 'Prof. Adesanya (ENG)', email: 't.adesanya@university.edu' },
  { label: 'Dr. Akinyele (LAW)',   email: 'y.akinyele@university.edu' },
];

export default function Login({ onLogin }: Props) {
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [showStudentPick, setShowStudentPick] = useState(false);
  const [showLecPick,     setShowLecPick]     = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    const expected = USER_CREDENTIALS[email.toLowerCase()];
    const user     = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && expected === password) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const fill = (e: string, p = 'student123') => {
    setEmail(e); setPassword(p);
    setShowStudentPick(false); setShowLecPick(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20 shadow-xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">UniScheduler</h1>
          <p className="text-blue-200 text-sm">MLP-Based Timetable Management System</p>
          <p className="text-blue-300/60 text-xs mt-1">Academic Session 2025/2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-gray-500 mb-6 text-sm">Access your timetable dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="your@university.edu" autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-semibold uppercase tracking-wide">Demo Quick Login</p>
            <div className="space-y-2">
              {/* Admin */}
              <button onClick={() => fill('admin@university.edu', 'admin123')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-red-200 hover:border-red-400 hover:bg-red-50 transition group">
                <Shield className="w-4 h-4 text-red-500" />
                <div className="text-left">
                  <p className="text-xs font-bold text-red-600">Administrator</p>
                  <p className="text-xs text-gray-400">Full system access · admin123</p>
                </div>
              </button>

              {/* Lecturer picker */}
              <div className="relative">
                <button onClick={() => { setShowLecPick(v => !v); setShowStudentPick(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div className="text-left flex-1">
                    <p className="text-xs font-bold text-purple-600">Lecturer</p>
                    <p className="text-xs text-gray-400">Pick a department · lecturer123</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${showLecPick ? 'rotate-180' : ''}`} />
                </button>
                {showLecPick && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {DEMO_LECTURERS.map(l => (
                      <button key={l.email} onClick={() => fill(l.email, 'lecturer123')}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition border-b border-gray-50 last:border-0">
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student picker */}
              <div className="relative">
                <button onClick={() => { setShowStudentPick(v => !v); setShowLecPick(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition">
                  <GraduationCap className="w-4 h-4 text-green-500" />
                  <div className="text-left flex-1">
                    <p className="text-xs font-bold text-green-600">Student</p>
                    <p className="text-xs text-gray-400">Pick a department · student123</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-green-400 transition-transform ${showStudentPick ? 'rotate-180' : ''}`} />
                </button>
                {showStudentPick && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-52 overflow-y-auto">
                    {DEMO_STUDENTS.map(s => (
                      <button key={s.email} onClick={() => fill(s.email, 'student123')}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700 transition border-b border-gray-50 last:border-0">
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200/50 text-xs mt-6">
          University Timetable Management System v3.0 · MLP-Powered
        </p>
      </div>
    </div>
  );
}
