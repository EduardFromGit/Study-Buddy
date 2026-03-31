import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  CheckSquare, 
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react'

export default function Tasks() {
  const navigate = useNavigate()
  const { tasks, subjects, notes, addTask, updateTask, deleteTask } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0],
    subject_id: '',
    note_id: '',
  })

  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    const today = new Date().toISOString().split('T')[0]

    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (filter === 'pending') result = result.filter(t => t.status === 'pending')
    if (filter === 'completed') result = result.filter(t => t.status === 'completed')
    if (filter === 'overdue') result = result.filter(t => t.due_date < today && t.status !== 'completed')

    return result.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  }, [tasks, search, filter])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Clean up empty fields to be NULL for Supabase
    const payload = {
      ...formData,
      subject_id: formData.subject_id || null,
      note_id: formData.note_id || null
    }

    try {
      await addTask(payload)
      setIsModalOpen(false)
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: new Date().toISOString().split('T')[0],
        subject_id: '',
        note_id: '',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    await updateTask(task.id, { status: newStatus })
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-fade-in max-w-[1200px] mx-auto py-4 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 px-1">
             <CheckSquare size={12} />
             <span>Task Library</span>
          </div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight">
            Milestones.
          </h1>
        </div>

        <Button 
          icon={Plus} 
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex !rounded-xl px-7 !py-3 bg-surface-900 dark:bg-white dark:text-surface-900 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          New Entry
        </Button>
      </div>

      {/* Toolbar / Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-transparent border-b border-surface-100 dark:border-surface-800 pb-6">
        <div className="relative flex-1 group w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Find a milestone..."
            className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-sm font-bold focus:ring-0 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {['all', 'pending', 'completed', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest
                transition-all cursor-pointer whitespace-nowrap
                ${filter === f 
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white' 
                  : 'text-surface-400 hover:text-surface-600'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-1">
        {filteredTasks.length === 0 ? (
          <div className="py-20 text-center">
             <p className="text-sm font-bold text-surface-300">Clean slate.</p>
          </div>
        ) : (
          filteredTasks.map((task, i) => (
            <div
              key={task.id}
              className={`
                group p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 border-b border-surface-50 dark:border-surface-800/50 
                hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors
              `}
            >
              <button
                onClick={() => toggleTaskStatus(task)}
                className={`
                  w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all cursor-pointer flex-shrink-0
                  ${task.status === 'completed' 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary-500'
                  }
                `}
              >
                {task.status === 'completed' ? <CheckCircle2 size={12} /> : null}
              </button>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-3">
                   <h3 className={`text-base font-bold tracking-tight truncate ${task.status === 'completed' ? 'line-through text-surface-300' : 'text-surface-900 dark:text-white'}`}>
                     {task.title}
                   </h3>
                   {task.note_id && (
                     <button 
                      onClick={() => navigate('/notes', { state: { selectedId: task.note_id } })}
                      className="text-[9px] font-black text-primary-500 opacity-60 hover:opacity-100 cursor-pointer"
                      title="View Linked Note"
                     >
                        [NOTE]
                     </button>
                   )}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto text-[10px] font-black uppercase tracking-widest text-surface-400">
                <div className={task.due_date < new Date().toISOString().split('T')[0] && task.status !== 'completed' ? 'text-red-500' : ''}>
                  {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>

                <div className="flex items-center gap-4 ml-auto">
                   <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-orange-400' : 'bg-emerald-400'
                   }`} />
                   
                   <button
                    onClick={() => {
                      if (window.confirm('Erase this milestone permanently? This action cannot be undone.')) {
                        deleteTask(task.id)
                      }
                    }}
                    className="p-2 text-surface-400 hover:text-danger-500 transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button 
         onClick={() => setIsModalOpen(true)}
         className="md:hidden fixed bottom-10 right-6 z-40 w-14 h-14 rounded-full bg-surface-900 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all cursor-pointer"
      >
         <Plus size={24} />
      </button>

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Milestone"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Label"
            placeholder="Keep it brief..."
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            className="!rounded-xl"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject"
              value={formData.subject_id}
              onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
              className="!rounded-xl"
            >
              <option value="">None</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>

            <Input
              label="Target Date"
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              required
              className="!rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
              className="!rounded-xl"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>

            <Select
              label="Linked Note"
              value={formData.note_id}
              onChange={e => setFormData({ ...formData, note_id: e.target.value })}
              className="!rounded-xl"
            >
              <option value="">None</option>
              {notes.map(n => (
                <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" loading={loading} className="!rounded-xl px-10">Add Milestone</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
