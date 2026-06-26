import { useState } from 'react';
import { Building2, Plus, Trash2, Edit2, X, Check, Search, Wifi, WifiOff } from 'lucide-react';
import {
  MOCK_LECTURERS, MOCK_ROOMS, MOCK_TIMESLOTS,
  addLecturer, updateLecturer, deleteLecturer,
  addRoom, updateRoom, deleteRoom, addTimeslot
} from '../../lib/mockData';
import { Lecturer, Room, Timeslot } from '../../types';
import { FACULTIES, DEPARTMENTS } from '../../lib/faculties';

interface Props { initialTab?: 'lecturers' | 'rooms' | 'timeslots'; }

export default function ResourceManagement({ initialTab = 'lecturers' }: Props) {
  const [tab,          setTab]          = useState<'lecturers'|'rooms'|'timeslots'>(initialTab);
  const [lecturers,    setLecturers]    = useState([...MOCK_LECTURERS]);
  const [rooms,        setRooms]        = useState([...MOCK_ROOMS]);
  const [timeslots,    setTimeslots]    = useState([...MOCK_TIMESLOTS]);
  const [search,       setSearch]       = useState('');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [showForm,     setShowForm]     = useState(false);
  const [deleteConfirm,setDeleteConfirm]= useState<string | null>(null);

  const [lecForm, setLecForm] = useState<Omit<Lecturer,'id'>>({
    name:'', email:'', department:'Computer Science', faculty:'Faculty of Computing & Digital Technologies',
    title:'Doctor', phone:'', maxHoursPerWeek:10
  });
  const [roomForm, setRoomForm] = useState<Omit<Room,'id'>>({
    name:'', capacity:60, type:'Classroom', building:'Block A', available:true, facilities:[]
  });
  const [slotForm, setSlotForm] = useState<Omit<Timeslot,'id'>>({
    day:'Monday', start_time:'08:00', end_time:'10:00', period:1
  });

  const refresh = () => {
    setLecturers([...MOCK_LECTURERS]);
    setRooms([...MOCK_ROOMS]);
    setTimeslots([...MOCK_TIMESLOTS]);
  };

  // Lecturer CRUD
  const saveLecturer = () => {
    if (editingId) { updateLecturer(editingId, lecForm); }
    else           { addLecturer(lecForm); }
    refresh(); setShowForm(false); setEditingId(null);
  };
  const editLecturer = (l: Lecturer) => {
    const { id, ...rest } = l; setLecForm(rest); setEditingId(id); setShowForm(true);
  };
  const removeLecturer = (id: string) => { deleteLecturer(id); refresh(); setDeleteConfirm(null); };

  // Room CRUD
  const saveRoom = () => {
    if (editingId) { updateRoom(editingId, roomForm); }
    else           { addRoom(roomForm); }
    refresh(); setShowForm(false); setEditingId(null);
  };
  const editRoom = (r: Room) => {
    const { id, ...rest } = r; setRoomForm(rest); setEditingId(id); setShowForm(true);
  };
  const removeRoom = (id: string) => { deleteRoom(id); refresh(); setDeleteConfirm(null); };

  // Timeslot CRUD
  const saveSlot = () => { addTimeslot(slotForm); refresh(); setShowForm(false); };

  const openAdd = () => {
    setEditingId(null);
    if (tab === 'lecturers') setLecForm({ name:'', email:'', department:'Computer Science', faculty:'Faculty of Computing & Digital Technologies', title:'Doctor', phone:'', maxHoursPerWeek:10 });
    if (tab === 'rooms')     setRoomForm({ name:'', capacity:60, type:'Classroom', building:'Block A', available:true, facilities:[] });
    if (tab === 'timeslots') setSlotForm({ day:'Monday', start_time:'08:00', end_time:'10:00', period:1 });
    setShowForm(true);
  };

  const filteredLecturers = lecturers.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.department.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.building.toLowerCase().includes(search.toLowerCase())
  );

  const fac = (deptName: string) => FACULTIES.find(f => {
    const dept = DEPARTMENTS.find(d => d.name === deptName);
    return dept && f.id === dept.facultyId;
  });

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const ROOM_TYPES = ['Lecture Theatre','Computer Lab','Classroom','Science Lab','Design Studio','Moot Court','Seminar Room'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Resource Management</h2>
            <p className="text-gray-500 text-sm">Lecturers, rooms, and timeslots</p>
          </div>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Add {tab === 'lecturers' ? 'Lecturer' : tab === 'rooms' ? 'Room' : 'Timeslot'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['lecturers','rooms','timeslots'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch(''); setShowForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${
              tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'lecturers' ? `Lecturers (${lecturers.length})` :
             t === 'rooms'     ? `Rooms (${rooms.length})` :
             `Timeslots (${timeslots.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab !== 'timeslots' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm" />
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit' : 'Add'} {tab === 'lecturers' ? 'Lecturer' : tab === 'rooms' ? 'Room' : 'Timeslot'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Lecturer form */}
              {tab === 'lecturers' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                      <input value={lecForm.name} onChange={e => setLecForm({...lecForm, name:e.target.value})} required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Dr. Ngozi Adeyemi" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <input type="email" value={lecForm.email} onChange={e => setLecForm({...lecForm, email:e.target.value})} required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="name@university.edu" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                      <select value={lecForm.title} onChange={e => setLecForm({...lecForm, title:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        {['Doctor','Professor','Mr','Mrs','Ms'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Max Hours/Week</label>
                      <input type="number" min={2} max={20} value={lecForm.maxHoursPerWeek ?? 10}
                        onChange={e => setLecForm({...lecForm, maxHoursPerWeek:Number(e.target.value)})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Faculty</label>
                      <select value={lecForm.faculty} onChange={e => {
                          const fac = FACULTIES.find(f => f.name === e.target.value);
                          const firstDept = fac ? DEPARTMENTS.find(d => d.facultyId === fac.id)?.name ?? '' : '';
                          setLecForm({...lecForm, faculty:e.target.value, department:firstDept});
                        }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        {FACULTIES.map(f => <option key={f.id} value={f.name}>{f.shortCode} — {f.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
                      <select value={lecForm.department} onChange={e => setLecForm({...lecForm, department:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        {DEPARTMENTS.filter(d => {
                          const f = FACULTIES.find(f => f.name === lecForm.faculty);
                          return f ? d.facultyId === f.id : true;
                        }).map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <input value={lecForm.phone ?? ''} onChange={e => setLecForm({...lecForm, phone:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="080xxxxxxxx" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                    <button onClick={saveLecturer} disabled={!lecForm.name || !lecForm.email}
                      className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
                    </button>
                  </div>
                </>
              )}

              {/* Room form */}
              {tab === 'rooms' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Room Name *</label>
                      <input value={roomForm.name} onChange={e => setRoomForm({...roomForm, name:e.target.value})} required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. LT-201" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Capacity *</label>
                      <input type="number" min={10} max={1000} value={roomForm.capacity}
                        onChange={e => setRoomForm({...roomForm, capacity:Number(e.target.value)})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Type *</label>
                      <select value={roomForm.type} onChange={e => setRoomForm({...roomForm, type:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Building *</label>
                      <input value={roomForm.building} onChange={e => setRoomForm({...roomForm, building:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Block A" />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="avail" checked={roomForm.available ?? true}
                        onChange={e => setRoomForm({...roomForm, available:e.target.checked})}
                        className="w-4 h-4 accent-indigo-600" />
                      <label htmlFor="avail" className="text-sm font-medium text-gray-700">Room is currently available</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                    <button onClick={saveRoom} disabled={!roomForm.name || !roomForm.building}
                      className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
                    </button>
                  </div>
                </>
              )}

              {/* Timeslot form */}
              {tab === 'timeslots' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Day *</label>
                      <select value={slotForm.day} onChange={e => setSlotForm({...slotForm, day:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        {DAYS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</label>
                      <input type="time" value={slotForm.start_time}
                        onChange={e => setSlotForm({...slotForm, start_time:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">End Time</label>
                      <input type="time" value={slotForm.end_time}
                        onChange={e => setSlotForm({...slotForm, end_time:e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Period #</label>
                      <input type="number" min={1} max={6} value={slotForm.period}
                        onChange={e => setSlotForm({...slotForm, period:Number(e.target.value)})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                    <button onClick={saveSlot}
                      className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Add Timeslot
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tables */}
      {tab === 'lecturers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm" style={{minWidth:'640px'}}>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name','Faculty','Department','Email','Hours/Wk','Actions'].map(h => (
                  <th key={h} className="text-left py-3.5 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map(l => {
                const f = fac(l.department);
                return (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{l.name}</td>
                    <td className="py-3.5 px-4">
                      {f && <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${f.color.badge} ${f.color.border}`}>{f.shortCode}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">{l.department}</td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{l.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">{l.maxHoursPerWeek}h</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => editLecturer(l)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                        {deleteConfirm === l.id ? (
                          <>
                            <button onClick={() => removeLecturer(l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(l.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLecturers.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">No lecturers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'rooms' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm" style={{minWidth:'600px'}}>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Room','Building','Type','Capacity','Facilities','Status','Actions'].map(h => (
                  <th key={h} className="text-left py-3.5 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{r.name}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{r.building}</td>
                  <td className="py-3.5 px-4 text-xs text-gray-600">{r.type}</td>
                  <td className="py-3.5 px-4"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{r.capacity}</span></td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">{(r.facilities ?? []).join(', ') || '—'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${r.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.available ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {r.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-1">
                      <button onClick={() => editRoom(r)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                      {deleteConfirm === r.id ? (
                        <>
                          <button onClick={() => removeRoom(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-400 rounded-lg transition"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(r.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'timeslots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeslots.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  s.day === 'Monday'    ? 'bg-red-100 text-red-700'    :
                  s.day === 'Tuesday'   ? 'bg-orange-100 text-orange-700' :
                  s.day === 'Wednesday' ? 'bg-green-100 text-green-700'  :
                  s.day === 'Thursday'  ? 'bg-blue-100 text-blue-700'    :
                  'bg-purple-100 text-purple-700'
                }`}>{s.day}</span>
                <span className="text-xs text-gray-400">Period {s.period}</span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-800">{s.start_time} – {s.end_time}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {parseInt(s.end_time) - parseInt(s.start_time)} hours
              </p>
            </div>
          ))}
          {timeslots.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">No timeslots defined</div>
          )}
        </div>
      )}
    </div>
  );
}
