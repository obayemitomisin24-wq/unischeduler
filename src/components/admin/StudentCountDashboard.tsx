import { useState, useMemo } from 'react';
import { Users, ChevronDown, ChevronRight, Search, Download } from 'lucide-react';
import { STUDENT_COUNTS, TOTAL_STUDENTS, getCountsByFaculty } from '../../lib/studentCounts';
import { FACULTIES } from '../../lib/faculties';

const LEVELS = [100, 200, 300, 400, 500];

export default function StudentCountDashboard() {
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'faculty' | 'department' | 'level'>('faculty');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

  const byFaculty = useMemo(() => getCountsByFaculty(), []);

  const filtered = useMemo(() => {
    if (!search) return STUDENT_COUNTS;
    const q = search.toLowerCase();
    return STUDENT_COUNTS.filter(d =>
      d.department.toLowerCase().includes(q) || d.faculty.toLowerCase().includes(q)
    );
  }, [search]);

  const getFacultyColor = (facultyName: string) => {
    const fac = FACULTIES.find(f => facultyName.toLowerCase().includes(f.shortCode.toLowerCase()) ||
      facultyName.toLowerCase().includes(f.name.split(' ').slice(-1)[0].toLowerCase()));
    return fac?.color ?? { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-600', header: 'bg-gray-600', dot: 'bg-gray-400' };
  };

  const levelColors: Record<number, string> = {
    100: 'bg-blue-100 text-blue-700',
    200: 'bg-green-100 text-green-700',
    300: 'bg-yellow-100 text-yellow-700',
    400: 'bg-orange-100 text-orange-700',
    500: 'bg-red-100 text-red-700',
  };

  const exportCSV = () => {
    const rows = [['Department', 'Faculty', 'Total', '100L', '200L', '300L', '400L', '500L']];
    STUDENT_COUNTS.forEach(d => rows.push([
      d.department, d.faculty, String(d.total),
      ...LEVELS.map(l => String(d.byLevel[l] ?? 0)),
    ]));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'student_counts.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Count</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {TOTAL_STUDENTS.toLocaleString()} students across {STUDENT_COUNTS.length} departments
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {LEVELS.map(l => {
          const total = STUDENT_COUNTS.reduce((s, d) => s + (d.byLevel[l] ?? 0), 0);
          return (
            <div key={l} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[l]}`}>{l}L</span>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{total.toLocaleString()}</p>
              <p className="text-xs text-gray-400">students</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search department or faculty..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white" />
        </div>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          {(['faculty', 'department', 'level'] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
                viewMode === v ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Faculty view */}
      {viewMode === 'faculty' && (
        <div className="space-y-3">
          {Object.entries(byFaculty).map(([faculty, data]) => {
            const isOpen = expandedFaculty === faculty;
            const fc     = getFacultyColor(faculty);
            return (
              <div key={faculty} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpandedFaculty(isOpen ? null : faculty)}
                  className={`w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${fc.dot}`} />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{faculty}</p>
                      <p className="text-xs text-gray-400">{data.departments.length} departments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-800 dark:text-white text-lg">{data.total.toLocaleString()}</p>
                      <div className="flex gap-1 mt-1">
                        {LEVELS.map(l => (
                          <span key={l} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${levelColors[l]}`}>
                            {l/100}:{data.byLevel[l] ?? 0}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: '580px' }}>
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="text-left py-3 px-5 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">Department</th>
                          <th className="text-center py-3 px-3 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">Total</th>
                          {LEVELS.map(l => (
                            <th key={l} className="text-center py-3 px-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[l]}`}>{l}L</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.departments.map(dept => (
                          <tr key={dept.department} className="border-t border-gray-50 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-gray-700 transition">
                            <td className="py-3 px-5 font-medium text-gray-800 dark:text-white">{dept.department}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="font-bold text-indigo-600">{dept.total}</span>
                            </td>
                            {LEVELS.map(l => (
                              <td key={l} className="py-3 px-3 text-center text-gray-600 dark:text-gray-300">{dept.byLevel[l] ?? 0}</td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-gray-50 dark:bg-gray-700 border-t-2 border-gray-200 dark:border-gray-600">
                          <td className="py-3 px-5 font-bold text-gray-800 dark:text-white">Faculty Total</td>
                          <td className="py-3 px-3 text-center font-bold text-indigo-700">{data.total}</td>
                          {LEVELS.map(l => (
                            <td key={l} className="py-3 px-3 text-center font-bold text-gray-700 dark:text-gray-200">
                              {data.byLevel[l] ?? 0}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Department view (flat search results) */}
      {viewMode === 'department' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: '640px' }}>
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              <tr>
                <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">Department</th>
                <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">Faculty</th>
                <th className="text-center py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">Total</th>
                {LEVELS.map(l => (
                  <th key={l} className="text-center py-3.5 px-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[l]}`}>{l}L</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(dept => {
                const fc = getFacultyColor(dept.faculty);
                return (
                  <tr key={dept.department} className="border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-gray-700 transition">
                    <td className="py-3 px-5 font-medium text-gray-800 dark:text-white">{dept.department}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${fc.badge} ${fc.border}`}>
                        {dept.faculty.split(' ').slice(-1)[0]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-600">{dept.total}</td>
                    {LEVELS.map(l => (
                      <td key={l} className="py-3 px-3 text-center text-gray-600 dark:text-gray-300">{dept.byLevel[l] ?? 0}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Level view — bar chart breakdown */}
      {viewMode === 'level' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedLevel('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${selectedLevel === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}>
              All Levels
            </button>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setSelectedLevel(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${selectedLevel === l ? 'bg-indigo-600 text-white border-indigo-600' : `border-gray-200 hover:bg-gray-50 ${levelColors[l]} dark:border-gray-600`}`}>
                {l} Level
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STUDENT_COUNTS
              .filter(d => !search || d.department.toLowerCase().includes(search.toLowerCase()))
              .map(dept => {
                const displayLevels = selectedLevel === 'all' ? LEVELS : [selectedLevel];
                const maxVal = Math.max(...LEVELS.map(l => dept.byLevel[l] ?? 0));
                return (
                  <div key={dept.department} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{dept.department}</p>
                      <span className="font-bold text-indigo-600 text-sm">{dept.total} total</span>
                    </div>
                    <div className="space-y-2">
                      {displayLevels.map(l => {
                        const val = dept.byLevel[l] ?? 0;
                        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        return (
                          <div key={l} className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-8 text-center flex-shrink-0 ${levelColors[l]}`}>{l}L</span>
                            <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-8 text-right">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
