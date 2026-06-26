import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, AppSettings } from './types';
import { loadSettings, applyTheme } from './lib/settings';
import Login               from './components/Login';
import Layout              from './components/shared/Layout';
import AdminDashboard      from './components/admin/AdminDashboard';
import LecturerDashboard   from './components/lecturer/LecturerDashboard';
import StudentDashboard    from './components/student/StudentDashboard';
import TimetableViewer     from './components/shared/TimetableViewer';
import CourseManagement    from './components/admin/CourseManagement';
import ResourceManagement  from './components/admin/ResourceManagement';
import ModelTraining       from './components/admin/ModelTraining';
import ChangeRequests      from './components/admin/ChangeRequests';
import StudentCountDashboard from './components/admin/StudentCountDashboard';
import Settings            from './components/admin/Settings';
import RolePreview         from './components/admin/RolePreview';
import ChangeReport        from './components/admin/ChangeReport';

export default function App() {
  const [user, setUser]       = useState<User | null>(() => {
    try { const s = sessionStorage.getItem('uni_user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Apply theme on mount and when settings change
  useEffect(() => { applyTheme(settings.theme); }, [settings.theme]);

  const handleLogin = (u: User) => {
    sessionStorage.setItem('uni_user', JSON.stringify(u));
    setUser(u);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('uni_user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const Dashboard = () => {
    if (user.role === 'admin')    return <AdminDashboard />;
    if (user.role === 'lecturer') return <LecturerDashboard user={user} />;
    return <StudentDashboard user={user} />;
  };

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout} settings={settings}>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/timetable" element={<TimetableViewer user={user} />} />

          {/* Admin-only routes */}
          {user.role === 'admin' && <>
            <Route path="/courses"   element={<CourseManagement />} />
            <Route path="/lecturers" element={<ResourceManagement initialTab="lecturers" />} />
            <Route path="/rooms"     element={<ResourceManagement initialTab="rooms" />} />
            <Route path="/generate"  element={<ModelTraining />} />
            <Route path="/requests"  element={<ChangeRequests />} />
            <Route path="/students"  element={<StudentCountDashboard />} />
            <Route path="/settings"  element={<Settings onSettingsChange={setSettings} />} />
            <Route path="/preview"   element={<RolePreview />} />
            <Route path="/changes"   element={<ChangeReport />} />
          </>}

          {/* Lecturer routes */}
          {user.role === 'lecturer' && <>
            <Route path="/courses"  element={<CourseManagement />} />
            <Route path="/settings" element={<Settings onSettingsChange={setSettings} />} />
          </>}

          {/* Student routes */}
          {user.role === 'student' && <>
            <Route path="/settings" element={<Settings onSettingsChange={setSettings} />} />
          </>}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
