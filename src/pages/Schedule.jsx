import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import { Calendar, Plus, Clock, Trash2, BookOpen, Sparkles } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const { subjects, schedules, addSchedule, deleteSchedule } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    subject_id: '',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await addSchedule({
      ...formData,
      subject_id: formData.subject_id || null
    })
    setLoading(false)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div>
           <div className="flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3 px-1">
              <Calendar size={12} />
              <span>Timetable Management</span>
           </div>
           <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tight">Weekly <span className="text-gradient">Protocol</span></h1>
           <p className="text-sm font-bold text-surface-400 mt-2">Design your ideal focus routine and eliminate decision fatigue.</p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => setIsModalOpen(true)}
          className="!rounded-2xl px-10 shadow-xl shadow-primary-500/10"
        >
          Add Block
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {DAYS.map(day => (
          <div key={day} className="space-y-6">
             <div className="px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 text-[10px] font-black uppercase tracking-widest text-center text-surface-400">
                {day}
             </div>
             
             <div className="space-y-4">
                {schedules.filter(s => s.day_of_week === day).length === 0 ? (
                  <div className="py-12 text-center opacity-20 border-2 border-dashed border-surface-100 dark:border-surface-800 rounded-3xl">
                     <span className="text-[10px] font-black uppercase tracking-widest">Rest</span>
                  </div>
                ) : (
                  schedules.filter(s => s.day_of_week === day).map(item => (
                    <Card key={item.id} className="!p-5 !rounded-2xl hover:border-primary-100 dark:hover:border-primary-900/10 group relative transition-all">
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subjects.find(s => s.id === item.subject_id)?.color || '#ccc' }} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 truncate">
                                {subjects.find(s => s.id === item.subject_id)?.name || 'Study Block'}
                             </span>
                          </div>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 text-sm font-bold text-surface-900 dark:text-white">
                                <Clock size={14} className="opacity-40" />
                                {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                             </div>
                             <button 
                               onClick={() => {
                                 if (window.confirm('Remove this study block from your weekly schedule?')) {
                                   deleteSchedule(item.id)
                                 }
                               }}
                               className="p-1.5 text-danger-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                             >
                                <Trash2 size={12} />
                             </button>
                          </div>
                       </div>
                    </Card>
                  ))
                )}
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Focus Block">
        <form onSubmit={handleSubmit} className="space-y-8 p-1">
           <Select 
             label="Primary Goal"
             value={formData.subject_id}
             onChange={e => setFormData({...formData, subject_id: e.target.value})}
             className="!rounded-2xl"
           >
              <option value="">Ungrouped Study</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
           </Select>

           <Select 
             label="Session Day"
             value={formData.day_of_week}
             onChange={e => setFormData({...formData, day_of_week: e.target.value})}
             className="!rounded-2xl"
           >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
           </Select>

           <div className="grid grid-cols-2 gap-6">
              <Input 
                label="Commence At"
                type="time"
                value={formData.start_time}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
                className="!rounded-2xl"
              />
              <Input 
                label="Conclude At"
                type="time"
                value={formData.end_time}
                onChange={e => setFormData({...formData, end_time: e.target.value})}
                className="!rounded-2xl"
              />
           </div>

           <div className="flex justify-end gap-3 pt-6">
              <Button type="submit" loading={loading} className="!rounded-2xl px-12">Confirm Schedule</Button>
           </div>
        </form>
      </Modal>
    </div>
  )
}
