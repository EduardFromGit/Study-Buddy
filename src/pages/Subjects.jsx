import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { Plus, BookOpen, Trash2, Edit3, Heart, ChevronRight, BarChart2, CheckSquare } from 'lucide-react'

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject, tasks, studySessions } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    color: '#8b5cf6',
    emoji: '📚',
  })

  const COLORS = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#06b6d4'
  ]

  const EMOJIS = ['📚', '🧬', '🧪', '🌍', '📐', '🎨', '💻', '🎼', '🩺', '⚖️', '🧠', '🚀']

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject)
      setFormData({ name: subject.name, color: subject.color, emoji: subject.emoji })
    } else {
      setEditingSubject(null)
      setFormData({ name: '', color: '#8b5cf6', emoji: '📚' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, formData)
      } else {
        await addSubject(formData)
      }
      setIsModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectStats = (id) => {
    const subjectTasks = tasks.filter(t => t.subject_id === id)
    const completed = subjectTasks.filter(t => t.status === 'completed').length
    const totalMinutes = studySessions
      .filter(s => s.subject_id === id)
      .reduce((acc, s) => acc + (s.duration || 0), 0)
    
    return {
      progress: subjectTasks.length > 0 ? Math.round((completed / subjectTasks.length) * 100) : 0,
      hours: Math.round(totalMinutes / 60 * 10) / 10,
      tasksCount: subjectTasks.length
    }
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1240px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">
             <BookOpen size={14} />
             <span>Knowledge Base</span>
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">
             My <span className="text-gradient">Subjects</span> <br />
             Curriculum.
          </h1>
        </div>

        <Button 
          icon={Plus} 
          size="lg" 
          onClick={() => handleOpenModal()}
          className="!rounded-2xl !py-4 shadow-xl hover:shadow-primary-500/20"
        >
          Define Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-surface-50 dark:bg-surface-800/30 rounded-3xl p-20 text-center border-2 border-dashed border-surface-200 dark:border-surface-700">
           <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary-500/10 rotate-6 group-hover:rotate-0 transition-all">
              <BookOpen size={40} className="text-primary-600" />
           </div>
           <h3 className="text-2xl font-black text-surface-900 dark:text-white mb-2">Build your library</h3>
           <p className="text-surface-500 max-w-sm mx-auto font-medium text-lg">Group your notes and tasks by subject to stay organized.</p>
           <Button 
             className="mt-10 !rounded-2xl px-10 !py-4"
             onClick={() => handleOpenModal()}
           >
             Create First Subject
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, i) => {
            const stats = getSubjectStats(subject.id)
            return (
              <Card 
                key={subject.id} 
                className="group !p-8 hover-lift !rounded-3xl border-2 border-transparent hover:border-primary-500/10 animate-fade-in transition-all overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl relative" style={{ backgroundColor: `${subject.color}15` }}>
                    <div className="absolute inset-x-0 bottom-[-4px] h-1.5 rounded-full opacity-40 blur-[2px]" style={{ backgroundColor: subject.color }} />
                    {subject.emoji}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(subject)}
                      className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 text-surface-400 hover:text-primary-600 transition-all cursor-pointer"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this subject? This will categorize related notes and tasks as "Ungrouped".')) {
                          deleteSubject(subject.id)
                        }
                      }}
                      className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 text-surface-400 hover:text-danger-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight mb-2 group-hover:text-primary-600 transition-colors">
                  {subject.name}
                </h3>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">
                    <BarChart2 size={12} className="text-primary-500" />
                    {stats.hours}h Studied
                  </div>
                  <div className="w-1 h-1 rounded-full bg-surface-300" />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">
                    <CheckSquare size={12} className="text-emerald-500" />
                    {stats.tasksCount} Tasks
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Milestones</span>
                    <span className="text-sm font-black text-primary-600">{stats.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden p-0.5 border border-surface-200 dark:border-surface-700">
                    <div
                      className="h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${stats.progress}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-danger-400" />
                    <span className="text-xs font-bold text-surface-500">Core Subject</span>
                  </div>
                  <ChevronRight size={18} className="text-surface-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Update Curriculum' : 'Define New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Subject Name"
            placeholder="e.g. Theoretical Physics"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            className="!rounded-2xl"
          />

          <div>
            <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-4 ml-1">
              Select Motif (Color)
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110 active:scale-95
                    ${formData.color === color ? 'border-primary-600 ring-4 ring-primary-500/10' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-4 ml-1">
              Select Identity (Emoji)
            </label>
            <div className="grid grid-cols-6 gap-3">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`
                    h-14 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer
                    ${formData.emoji === emoji 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' 
                      : 'bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit" loading={loading} className="!rounded-xl px-12">
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
