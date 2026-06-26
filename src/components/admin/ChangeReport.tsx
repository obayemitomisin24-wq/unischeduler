import { useState } from 'react';
import { FolderGit2 as GitDiff, Clock, FileText, Download, Info } from 'lucide-react';

interface FileChange {
  path: string;
  type: 'new' | 'modified' | 'deleted';
  description: string;
  linesChanged?: number;
}

// This tracks exactly which files were added/changed in this upgrade
const CHANGE_LOG: { version: string; date: string; summary: string; files: FileChange[] }[] = [
  {
    version: 'v3.1.0',
    date: new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
    summary: '6 new features: Student counts, Exam timetable, Settings, Role preview, Course-level auto-detection, File change report',
    files: [
      // New files
      { path: 'src/lib/examTimetable.ts',                      type: 'new',      description: 'Full parsed 2025/2026 Sem 2 exam timetable with clash detection',              linesChanged: 210 },
      { path: 'src/lib/studentCounts.ts',                      type: 'new',      description: 'Student population per department and level (100–500) for all 55 depts',      linesChanged: 75  },
      { path: 'src/lib/settings.ts',                           type: 'new',      description: 'App settings persistence (localStorage) with theme apply helper',              linesChanged: 28  },
      { path: 'src/components/admin/StudentCountDashboard.tsx', type: 'new',      description: 'Student count UI: faculty accordion, department table, level bar chart, CSV export', linesChanged: 180 },
      { path: 'src/components/admin/ExamTimetableView.tsx',     type: 'new',      description: 'Exam timetable viewer: date/faculty/level filters, clash detection, CSV export',  linesChanged: 175 },
      { path: 'src/components/admin/Settings.tsx',              type: 'new',      description: 'Full settings panel: light/dark theme, accent color, font size, profile, password, notifications', linesChanged: 210 },
      { path: 'src/components/admin/RolePreview.tsx',           type: 'new',      description: 'Admin preview mode: see student and lecturer dashboards as any specific user',  linesChanged: 130 },
      { path: 'src/components/admin/ChangeReport.tsx',          type: 'new',      description: 'This file — tracks and displays all changed/added files with descriptions',    linesChanged: 120 },
      // Modified files
      { path: 'src/types/index.ts',                            type: 'modified', description: 'Added ExamSlot, ExamEntry, DepartmentCount, AppSettings, UserProfile types',   linesChanged: 45  },
      { path: 'src/App.tsx',                                   type: 'modified', description: 'Added 5 new routes: /students, /exams, /settings, /preview, /changes',         linesChanged: 15  },
      { path: 'src/components/shared/Layout.tsx',              type: 'modified', description: 'Added 5 nav items to admin sidebar with icons',                                 linesChanged: 12  },
    ],
  },
  {
    version: 'v3.0.0',
    date: 'Previous build',
    summary: 'MLP scheduler engine, faculty colour system, enhanced mock data, full role dashboards',
    files: [
      { path: 'src/lib/scheduler.ts',                          type: 'new',      description: 'Pure TypeScript MLP neural network + constraint repair engine' },
      { path: 'src/lib/faculties.ts',                          type: 'new',      description: '9 faculties, 55 departments with full colour palettes' },
      { path: 'src/lib/mockData.ts',                           type: 'modified', description: 'Enhanced with enrollment, course types, lecturer constraints, notifications, sessions' },
      { path: 'src/components/admin/ModelTraining.tsx',        type: 'modified', description: 'Real MLP training loop with live metrics and generation result' },
      { path: 'src/components/admin/AdminDashboard.tsx',       type: 'modified', description: 'Lecturer workload bars, system health, notifications panel' },
      { path: 'src/components/lecturer/LecturerDashboard.tsx', type: 'new',      description: 'Full lecturer dashboard with schedule, workload stats, change request form' },
      { path: 'src/components/student/StudentDashboard.tsx',   type: 'modified', description: 'Faculty-aware dashboard with today view, weekly schedule, faculty overview' },
      { path: 'src/components/shared/TimetableViewer.tsx',     type: 'modified', description: 'Semester filter, conflict detection, CSV export, enrollment display' },
      { path: 'src/components/admin/ChangeRequests.tsx',       type: 'modified', description: 'Expandable response panel, auto-notification on decision' },
    ],
  },
];

export default function ChangeReport() {
  const [expanded, setExpanded] = useState<string>('v3.1.0');
  const [copied, setCopied]     = useState(false);

  const typeColor: Record<string, string> = {
    new:      'bg-green-100 text-green-700 border-green-200',
    modified: 'bg-blue-100 text-blue-700 border-blue-200',
    deleted:  'bg-red-100 text-red-700 border-red-200',
  };

  const typeLabel: Record<string, string> = { new: 'NEW', modified: 'MOD', deleted: 'DEL' };

  const copyPaths = (files: FileChange[]) => {
    navigator.clipboard.writeText(files.map(f => f.path).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReport = () => {
    const lines: string[] = ['UniScheduler — File Change Report', '='.repeat(50), ''];
    for (const log of CHANGE_LOG) {
      lines.push(`## ${log.version}  (${log.date})`);
      lines.push(log.summary);
      lines.push('');
      for (const f of log.files) {
        lines.push(`  [${typeLabel[f.type]}] ${f.path}`);
        lines.push(`        ${f.description}`);
        if (f.linesChanged) lines.push(`        ~${f.linesChanged} lines`);
      }
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'change_report.txt'; a.click();
  };

  const latestNew      = CHANGE_LOG[0].files.filter(f => f.type === 'new').length;
  const latestModified = CHANGE_LOG[0].files.filter(f => f.type === 'modified').length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <GitDiff className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">File Change Report</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Exactly which files changed — merge these into your original codebase
            </p>
          </div>
        </div>
        <button onClick={exportReport}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary banner for latest version */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <p className="font-bold text-emerald-800 dark:text-emerald-300">Latest Release — {CHANGE_LOG[0].version}</p>
        </div>
        <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-3">{CHANGE_LOG[0].summary}</p>
        <div className="flex gap-3 flex-wrap">
          <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
            {latestNew} new files
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
            {latestModified} modified files
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full font-semibold">
            {CHANGE_LOG[0].files.reduce((s, f) => s + (f.linesChanged ?? 0), 0)} lines changed
          </span>
        </div>
      </div>

      {/* Merge instructions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4">
        <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">How to merge into your original codebase</p>
        <ol className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-decimal list-inside">
          <li>Files marked <span className="font-bold">NEW</span> — copy the entire file into your project at the path shown</li>
          <li>Files marked <span className="font-bold">MOD</span> — replace your existing file with the new version</li>
          <li>Run <code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded font-mono text-xs">npm install</code> then <code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded font-mono text-xs">npx tsc --noEmit</code> to verify zero errors</li>
          <li>Deploy as normal with <code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded font-mono text-xs">npm run build</code></li>
        </ol>
      </div>

      {/* Version accordions */}
      {CHANGE_LOG.map(log => (
        <div key={log.version} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Version header */}
          <button
            onClick={() => setExpanded(expanded === log.version ? '' : log.version)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-bold text-gray-800 dark:text-white">{log.version}</p>
                <p className="text-xs text-gray-400 mt-0.5">{log.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 hidden sm:flex">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {log.files.filter(f => f.type === 'new').length} new
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {log.files.filter(f => f.type === 'modified').length} modified
                </span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {expanded === log.version && (
            <div className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">{log.summary}</p>
                <button
                  onClick={() => copyPaths(log.files)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                  {copied ? 'Copied!' : 'Copy all paths'}
                </button>
              </div>

              <div className="space-y-2">
                {log.files.map((file, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${typeColor[file.type]}`}>
                      {typeLabel[file.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate">{file.path}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{file.description}</p>
                    </div>
                    {file.linesChanged && (
                      <span className="flex-shrink-0 text-xs text-gray-400 font-mono">~{file.linesChanged}L</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
