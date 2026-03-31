import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { 
  Search, 
  Plus, 
  FileText, 
  Trash2, 
  Tag, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2,
  ListTodo
} from 'lucide-react'

export default function Notes() {
  const location = useLocation()
  const { notes, subjects, tasks, addNote, updateNote, deleteNote } = useData()
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeout = useRef(null)

  // Local buffer states to prevent re-render lag
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [localSubject, setLocalSubject] = useState('')
  const [localTags, setLocalTags] = useState('')

  const selectedNote = notes.find(n => n.id === selectedId) || null
  const linkedTasks = tasks.filter(t => t.note_id === selectedId)

  // Pick up selectedId from navigation state (Trace Note feature)
  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId)
    }
  }, [location.state])

  // When selectedId changes, sync the local buffer
  useEffect(() => {
    if (selectedNote) {
      setLocalTitle(selectedNote.title || '')
      setLocalContent(selectedNote.content || '')
      setLocalSubject(selectedNote.subject_id || '')
      setLocalTags(selectedNote.tags || '')
    } else {
      setLocalTitle('')
      setLocalContent('')
      setLocalSubject('')
      setLocalTags('')
    }
  }, [selectedId, notes.length])

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

  const handleCreate = async () => {
    const { data } = await addNote({
      title: 'Untitled Note',
      content: '',
      tags: '',
      subject_id: subjects[0]?.id || null
    })
    if (data) setSelectedId(data[0].id)
  }

  const debouncedSave = (field, value) => {
    setIsSaving(true)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    
    saveTimeout.current = setTimeout(async () => {
      await updateNote(selectedId, { [field]: value })
      setIsSaving(false)
    }, 1500)
  }

  const handleTitleChange = (e) => {
    const val = e.target.value
    setLocalTitle(val)
    debouncedSave('title', val)
  }

  const handleContentChange = (e) => {
    const val = e.target.value
    setLocalContent(val)
    debouncedSave('content', val)
  }

  const handleSubjectChange = (e) => {
    const val = e.target.value
    setLocalSubject(val)
    updateNote(selectedId, { subject_id: val })
  }

  const handleTagsChange = (e) => {
    const val = e.target.value
    setLocalTags(val)
    debouncedSave('tags', val)
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 animate-fade-in max-w-[1400px] mx-auto py-2">
      {/* Sidebar List */}
      <div className="w-full lg:w-[380px] flex flex-col gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <div>
                <div className="flex items-center gap-2 text-primary-600 font-extrabold text-[10px] uppercase tracking-[0.3em] mb-2 px-1">
                   <FileText size={12} />
                   <span>Workspace</span>
                </div>
                <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tight">Study Notes</h1>
             </div>
             <button 
               onClick={handleCreate}
               className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
             >
                <Plus size={28} />
             </button>
          </div>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search in knowledge..."
              className="w-full bg-white dark:bg-surface-800 border-none py-5 pl-16 pr-8 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-primary-500/10 transition-all outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar px-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 px-8 rounded-[3rem] bg-surface-50 dark:bg-surface-900/50 border-2 border-dashed border-surface-200 dark:border-surface-800">
               <div className="w-20 h-20 bg-white dark:bg-surface-900 rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-8 animate-float">
                  <FileText size={36} className="text-surface-200" />
               </div>
               <p className="text-sm font-black text-surface-400 uppercase tracking-widest leading-relaxed">Your knowledge library is currently empty.</p>
               <button onClick={handleCreate} className="mt-8 text-[11px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-500 cursor-pointer">Start Your Journey</button>
            </div>
          ) : (
            filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                className={`
                  w-full text-left p-7 rounded-[2rem] transition-all duration-300 relative group truncate border-2
                  ${selectedId === note.id 
                    ? 'bg-primary-600 text-white border-transparent shadow-2xl shadow-primary-500/30' 
                    : 'bg-white dark:bg-surface-800 border-surface-100 dark:border-surface-800 hover:border-primary-500/30 hover:shadow-2xl hover:translate-y-[-2px]'}
                `}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-lg tracking-tight leading-tight truncate pr-4">
                    {note.title || 'Untitled Note'}
                  </h3>
                  {selectedId === note.id && isSaving && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_12px_white]" />
                  )}
                </div>
                <p className={`text-xs font-bold line-clamp-2 leading-relaxed ${selectedId === note.id ? 'text-white/70' : 'text-surface-400 dark:text-surface-500'}`}>
                  {note.content || 'No content captured yet...'}
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${selectedId === note.id ? 'bg-white/10 text-white' : 'bg-surface-50 dark:bg-surface-900 text-surface-400'}`}>
                    {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                  {note.subject_id && (
                    <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${selectedId === note.id ? 'bg-white/10 text-white' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                       {subjects.find(s => s.id === note.subject_id)?.name}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <Card className="flex-1 !p-12 flex flex-col animate-fade-in !rounded-[3rem] border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/10 transition-all shadow-2xl shadow-primary-500/5 overflow-hidden">
            <div className="flex flex-col gap-8 mb-10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                   <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-black text-[10px] uppercase tracking-[0.25em]">
                      <Sparkles size={16} className="fill-primary-500" />
                      Studio Mode
                   </div>
                   {isSaving ? (
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 animate-pulse">Syncing to cloud...</span>
                   ) : (
                     <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <CheckCircle2 size={14} />
                        Live Synced
                     </div>
                   )}
                </div>
                
                <div className="flex items-center gap-4">
                   <button
                    onClick={() => {
                      if (window.confirm('Delete this note permanently?')) {
                        deleteNote(selectedId)
                        setSelectedId(null)
                      }
                    }}
                    className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800 text-surface-300 hover:text-danger-500 hover:bg-danger-50 transition-all cursor-pointer"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>

              <input
                className="text-5xl font-black text-surface-900 dark:text-white bg-transparent outline-none tracking-tight placeholder:text-surface-100 dark:placeholder:text-surface-800"
                placeholder="Title your thoughts..."
                value={localTitle}
                onChange={handleTitleChange}
              />

              <div className="flex flex-wrap items-center gap-6 border-y border-surface-100 dark:border-surface-800 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center text-surface-300">
                     <BookOpen size={18} />
                  </div>
                  <Select
                    value={localSubject}
                    onChange={handleSubjectChange}
                    className="!py-2 !rounded-xl !text-[11px] !font-black !uppercase !tracking-widest !bg-transparent !border-none !ring-0 !shadow-none min-w-[160px] !text-primary-600"
                  >
                    <option value="">Ungrouped</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="w-px h-8 bg-surface-100 dark:bg-surface-800 hidden md:block" />

                <div className="flex items-center gap-4 flex-1">
                   <div className="w-10 h-10 rounded-2xl bg-surface-50 dark:bg-surface-900 flex items-center justify-center text-surface-300">
                      <Tag size={18} />
                   </div>
                   <input
                    placeholder="Add tags comma separated..."
                    className="flex-1 bg-transparent text-sm font-bold text-surface-600 dark:text-surface-400 outline-none placeholder:text-surface-200 dark:placeholder:text-surface-800"
                    value={localTags}
                    onChange={handleTagsChange}
                  />
                </div>
              </div>
            </div>

            <textarea
              className="flex-1 w-full bg-transparent resize-none outline-none text-xl font-medium leading-[1.8] text-surface-800 dark:text-surface-200 placeholder:text-surface-100 dark:placeholder:text-surface-800 custom-scrollbar pr-4 pb-12"
              placeholder="What are we learning today? Start your masterpiece here..."
              value={localContent}
              onChange={handleContentChange}
            />

            {/* LINKED TASKS TRACER */}
            {linkedTasks.length > 0 && (
               <div className="pb-10 animate-slide-up">
                  <div className="p-6 rounded-[2rem] bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800">
                     <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest text-surface-400 px-1">
                        <ListTodo size={14} className="text-primary-500" />
                        Linked Study Milestones
                     </div>
                     <div className="space-y-3">
                        {linkedTasks.map(task => (
                           <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-surface-800 rounded-2xl shadow-sm">
                              <span className={`text-sm font-bold ${task.status === 'completed' ? 'line-through opacity-40' : 'text-surface-900 dark:text-white'}`}>
                                 {task.title}
                              </span>
                              <Badge variant={task.priority === 'high' ? 'danger' : 'default'} className="!text-[9px]">{task.priority}</Badge>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
            
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-surface-300 border-t border-surface-50 dark:border-surface-800 pt-8">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    Edited {new Date(selectedNote.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div className="hidden sm:block">{localContent.length} chars captured</div>
               </div>
               <div className="flex items-center gap-2 text-primary-500 opacity-60">
                  <Sparkles size={12} className="fill-primary-500" />
                  Auto-sync: Active
               </div>
            </div>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-surface-900 border-2 border-dashed border-surface-100 dark:border-surface-800 rounded-[4rem]">
            <div className="w-28 h-28 rounded-[3rem] bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-10 animate-float">
               <Sparkles size={56} className="text-primary-600" />
            </div>
            <h2 className="text-4xl font-black text-surface-900 dark:text-white mb-3 tracking-tighter">Editor Workspace</h2>
            <p className="text-xl font-bold text-surface-400 max-w-sm text-center opacity-70">Focus on the thoughts that matter. Start your journey by creating or selecting a project note.</p>
            <Button className="mt-14 !rounded-[1.5rem] px-16 !py-6 text-base tracking-widest shadow-2xl" icon={Plus} onClick={handleCreate}>
              Deploy New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
