import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check, BookOpen, Search } from 'lucide-react';
import { Course } from '../../types';
import { MOCK_COURSES, MOCK_LECTURERS, addCourse, updateCourse, deleteCourse } from '../../lib/mockData';
import { FACULTIES, DEPARTMENTS as ALL_DEPTS } from '../../lib/faculties';

type FormState = Omit<Course, 'id'>;

const EMPTY_FORM: FormState = {
  code: '', title: '', semester: 1, year: 1, credits: 3,
  department: 'Computer Science',
  faculty: 'Faculty of Computing & Digital Technologies',
  lecturer_id: '',
};

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(() => [...MOCK_COURSES]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = () => setCourses([...MOCK_COURSES]);

  const filtered = courses.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase()) ||
    (c.faculty ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };

  const openEdit = (course: Course) => {
    const { id, ...rest } = course;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) { updateCourse(editingId, form); } else { addCourse(form); }
    setShowForm(false);
    refresh();
  };

  const handleDelete = (id: string) => { deleteCourse(id); setDeleteConfirm(null); refresh(); };

  const deptsByFaculty = ALL_DEPTS.filter(d => {
    const fac = FACULTIES.find(f => f.name === form.faculty);
    return fac ? d.facultyId === fac.id : true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Course Management</h2>
            <p className="text-gray-500 text-sm">{courses.length} courses registered</p>
          </div>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by code, title, department or faculty..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm" />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. CSC301" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                  <input required type="number" min="1" max="6" value={form.credits}
                    onChange={e => setForm({ ...form, credits: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Data Structures & Algorithms" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                <select value={form.faculty}
                  onChange={e => {
                    const fac = FACULTIES.find(f => f.name === e.target.value);
                    const firstDept = fac ? ALL_DEPTS.find(d => d.facultyId === fac.id)?.name ?? '' : '';
                    setForm({ ...form, faculty: e.target.value, department: firstDept });
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  {FACULTIES.map(f => <option key={f.id} value={f.name}>{f.shortCode} — {f.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {deptsByFaculty.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lecturer</label>
                  <select value={form.lecturer_id || ''} onChange={e => setForm({ ...form, lecturer_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">— Unassigned —</option>
                    {MOCK_LECTURERS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                  <select value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value={1}>First Semester</option>
                    <option value={2}>Second Semester</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '700px' }}>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Code</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Title</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Faculty</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Department</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Yr/Sem</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Cr</th>
              <th className="text-left py-3.5 px-4 text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(course => {
              const fac = FACULTIES.find(f => f.name === course.faculty);
              return (
                <tr key={course.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{course.code}</td>
                  <td className="py-3.5 px-4 text-gray-800 font-medium">{course.title}</td>
                  <td className="py-3.5 px-4">
                    {fac && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${fac.color.badge} ${fac.color.border}`}>
                        {fac.shortCode}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{course.department}</td>
                  <td className="py-3.5 px-4 text-gray-500">Y{course.year}/S{course.semester}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{course.credits}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(course)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deleteConfirm === course.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(course.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No courses found</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
