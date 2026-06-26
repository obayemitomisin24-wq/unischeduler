import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Save, User, Lock, Bell, Monitor, Check, Eye, EyeOff } from 'lucide-react';
import { AppSettings } from '../../types';
import { loadSettings, saveSettings, applyTheme } from '../../lib/settings';

interface Props { onSettingsChange?: (s: AppSettings) => void; }

export default function Settings({ onSettingsChange }: Props) {
  const [settings,    setSettings]    = useState<AppSettings>(loadSettings);
  const [tab,         setTab]         = useState<'appearance'|'profile'|'security'|'notifications'>('appearance');
  const [saved,       setSaved]       = useState(false);
  const [showPwd,     setShowPwd]     = useState({ current: false, new: false, confirm: false });
  const [profile,     setProfile]     = useState({ name: '', email: '', phone: '', department: '' });
  const [passwords,   setPasswords]   = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError,    setPwdError]    = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => { applyTheme(settings.theme); }, [settings.theme]);

  const updateSetting = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveSettings(next);
    onSettingsChange?.(next);
    if (key === 'theme') applyTheme(val as 'light' | 'dark');
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordSave = () => {
    if (passwords.newPwd !== passwords.confirm) { setPwdError('Passwords do not match'); return; }
    if (passwords.newPwd.length < 6) { setPwdError('Password must be at least 6 characters'); return; }
    setPwdError('');
    setPasswords({ current: '', newPwd: '', confirm: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const colors = ['indigo','blue','purple','green','red','orange','teal','pink'];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">System Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your preferences and account</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit flex-wrap">
        {([
          { key: 'appearance',    label: 'Appearance',    icon: <Monitor className="w-4 h-4" /> },
          { key: 'profile',       label: 'Profile',       icon: <User className="w-4 h-4" /> },
          { key: 'security',      label: 'Security',      icon: <Lock className="w-4 h-4" /> },
          { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t.key ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Appearance */}
      {tab === 'appearance' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          {/* Theme */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white mb-3">Theme</p>
            <div className="flex gap-3">
              {(['light','dark'] as const).map(t => (
                <button key={t} onClick={() => updateSetting('theme', t)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                    settings.theme === t ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}>
                  {t === 'light' ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6 text-indigo-500" />}
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{t}</span>
                  {settings.theme === t && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white mb-3">Accent Colour</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button key={c} onClick={() => updateSetting('primaryColor', c)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ring-2 ring-offset-2 ${
                    settings.primaryColor === c ? 'ring-gray-800 dark:ring-white scale-110' : 'ring-transparent'
                  } bg-${c}-500`}
                  style={{ backgroundColor: `var(--${c}-500, #6366f1)` }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white mb-3">Font Size</p>
            <div className="flex gap-2">
              {([['sm','Small'],['md','Medium'],['lg','Large']] as const).map(([val, lbl]) => (
                <button key={val} onClick={() => updateSetting('fontSize', val)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    settings.fontSize === val ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* Compact mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">Compact Mode</p>
              <p className="text-xs text-gray-400">Reduce spacing and padding throughout the UI</p>
            </div>
            <button onClick={() => updateSetting('compactMode', !settings.compactMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.compactMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.compactMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <button onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}>
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
          </button>
        </div>
      )}

      {/* Profile */}
      {tab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <p className="font-semibold text-gray-800 dark:text-white">Profile Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name',       label: 'Full Name',   placeholder: 'Dr. Adebayo Okafor', type: 'text'  },
              { key: 'email',      label: 'Email',       placeholder: 'admin@university.edu', type: 'email' },
              { key: 'phone',      label: 'Phone',       placeholder: '080xxxxxxxx', type: 'tel'  },
              { key: 'department', label: 'Department',  placeholder: 'Academic Affairs', type: 'text'  },
            ].map(field => (
              <div key={field.key}>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{field.label}</label>
                <input
                  type={field.type}
                  value={profile[field.key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white" />
              </div>
            ))}
          </div>
          <button onClick={handleProfileSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              profileSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}>
            {profileSaved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Update Profile</>}
          </button>
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <p className="font-semibold text-gray-800 dark:text-white">Change Password</p>
          {[
            { key: 'current',  label: 'Current Password', field: 'current' as const },
            { key: 'newPwd',   label: 'New Password',     field: 'new' as const },
            { key: 'confirm',  label: 'Confirm New Password', field: 'confirm' as const },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{f.label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd[f.field] ? 'text' : 'password'}
                  value={passwords[f.key as keyof typeof passwords]}
                  onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white" />
                <button type="button" onClick={() => setShowPwd(p => ({ ...p, [f.field]: !p[f.field] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd[f.field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          {pwdError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{pwdError}</p>}
          <button onClick={handlePasswordSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}>
            {saved ? <><Check className="w-4 h-4" /> Password Updated!</> : <><Lock className="w-4 h-4" /> Change Password</>}
          </button>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <p className="font-semibold text-gray-800 dark:text-white">Notification Preferences</p>
          {[
            { key: 'notifications',   label: 'System Notifications',       desc: 'Enable all system notifications' },
            { key: 'changeRequests',  label: 'Change Request Alerts',       desc: 'Get notified when change requests are submitted' },
            { key: 'conflicts',       label: 'Conflict Warnings',           desc: 'Alerts when scheduling conflicts are detected' },
            { key: 'mlpComplete',     label: 'MLP Generation Complete',     desc: 'Notify when timetable generation finishes' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}>
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
        </div>
      )}
    </div>
  );
}
