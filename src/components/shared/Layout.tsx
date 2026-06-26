import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, BookOpen, Users, Building2,
  LogOut, Menu, Bell, RefreshCw, Zap, ChevronDown,
  User, GraduationCap, Settings, Eye, FolderGit2,
  Moon, Sun
} from 'lucide-react';
import { User as UserType, AppSettings } from '../../types';
import { MOCK_NOTIFICATIONS, MOCK_CHANGE_REQUESTS, getActiveSession } from '../../lib/mockData';
import { saveSettings, applyTheme } from '../../lib/settings';

interface Props {
  user: UserType;
  onLogout: () => void;
  children: React.ReactNode;
  settings: AppSettings;
}

export default function Layout({ user, onLogout, children, settings }: Props) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const location = useLocation();

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => n.user_id === user.id && !n.read).length;
  const pendingReqs  = MOCK_CHANGE_REQUESTS.filter(r => r.status === 'pending').length;
  const session      = getActiveSession();

  const isDark = settings.theme === 'dark';

  const toggleTheme = () => {
    const next = { ...settings, theme: isDark ? 'light' as const : 'dark' as const };
    saveSettings(next);
    applyTheme(next.theme);
    // Force page re-render via a small trick
    document.documentElement.classList.toggle('dark', next.theme === 'dark');
  };

  type NavItem = { path: string; label: string; icon: React.ReactNode; badge?: number; section?: string };

  const adminNav: NavItem[] = [
    { path: '/',          label: 'Dashboard',     icon: <LayoutDashboard className="w-4 h-4" />,  section: 'main' },
    { path: '/timetable', label: 'Timetable',     icon: <Calendar className="w-4 h-4" />,         section: 'main' },
    { path: '/courses',   label: 'Courses',       icon: <BookOpen className="w-4 h-4" />,          section: 'main' },
    { path: '/lecturers', label: 'Lecturers',     icon: <Users className="w-4 h-4" />,             section: 'main' },
    { path: '/rooms',     label: 'Rooms',         icon: <Building2 className="w-4 h-4" />,         section: 'main' },
    { path: '/generate',  label: 'MLP Generator', icon: <Zap className="w-4 h-4" />,               section: 'tools' },
    { path: '/requests',  label: 'Requests',      icon: <RefreshCw className="w-4 h-4" />,         section: 'tools', badge: pendingReqs },
    { path: '/students',  label: 'Student Count', icon: <GraduationCap className="w-4 h-4" />,    section: 'tools' },
    { path: '/preview',   label: 'Role Preview',  icon: <Eye className="w-4 h-4" />,               section: 'admin' },
    { path: '/changes',   label: 'Change Report', icon: <FolderGit2 className="w-4 h-4" />,           section: 'admin' },
    { path: '/settings',  label: 'Settings',      icon: <Settings className="w-4 h-4" />,          section: 'admin' },
  ];

  const lecturerNav: NavItem[] = [
    { path: '/',          label: 'Dashboard',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/timetable', label: 'Timetable',  icon: <Calendar className="w-4 h-4" /> },
    { path: '/courses',   label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/settings',  label: 'Settings',   icon: <Settings className="w-4 h-4" /> },
  ];

  const studentNav: NavItem[] = [
    { path: '/',          label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4" /> },
    { path: '/settings',  label: 'Settings',  icon: <Settings className="w-4 h-4" /> },
  ];

  const navItems = user.role === 'admin' ? adminNav : user.role === 'lecturer' ? lecturerNav : studentNav;

  const sections = user.role === 'admin'
    ? [
        { key: 'main',  label: 'Scheduling' },
        { key: 'tools', label: 'Tools' },
        { key: 'admin', label: 'Administration' },
      ]
    : [{ key: '', label: '' }];

  const roleColor: Record<string, string> = {
    admin:    'bg-red-100 text-red-700',
    lecturer: 'bg-purple-100 text-purple-700',
    student:  'bg-blue-100 text-blue-700',
  };

  const pageLabel: Record<string, string> = {
    '/':          'Dashboard',
    '/timetable': 'Timetable',
    '/courses':   'Courses',
    '/lecturers': 'Lecturers',
    '/rooms':     'Rooms',
    '/generate':  'MLP Generator',
    '/requests':  'Change Requests',
    '/students':  'Student Count',
    '/exams':     'Exam Timetable',
    '/preview':   'Role Preview',
    '/changes':   'Change Report',
    '/settings':  'Settings',
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 dark:text-white leading-none text-sm">UniScheduler</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">MLP Timetable System</p>
          </div>
        </div>
      </div>

      {/* Session */}
      <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
        <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold">{session.year} · Semester {session.semester}</p>
        <p className="text-[10px] text-indigo-400 dark:text-indigo-500">{session.startDate} — {session.endDate}</p>
      </div>

      {/* User */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${roleColor[user.role]}`}>
            {user.role}
          </span>
        </div>
        {user.department && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 pl-10 truncate">{user.department}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {user.role === 'admin' ? (
          sections.map(sec => {
            const items = navItems.filter(n => n.section === sec.key);
            if (items.length === 0) return null;
            return (
              <div key={sec.key} className="mb-1">
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 py-1.5">{sec.label}</p>
                {items.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-xl text-xs font-medium transition relative mb-0.5 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}>
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="px-2">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition mb-0.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
        <button onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex ${isDark ? 'dark' : ''}`}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-0 bottom-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 z-50 shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm font-semibold text-gray-800 dark:text-white flex-1">
            {pageLabel[location.pathname] ?? 'UniScheduler'}
          </p>
          <div className="flex items-center gap-2">
            {/* Quick theme toggle in top bar */}
            <button onClick={toggleTheme}
              className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Notification bell */}
            {unreadNotifs > 0 && (
              <div className="relative">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              </div>
            )}

            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium text-gray-700 dark:text-gray-200">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline max-w-28 truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${roleColor[user.role]}`}>{user.role}</span>
                  </div>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
