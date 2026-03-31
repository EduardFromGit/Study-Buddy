import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [schedules, setSchedules] = useState([])
  const [studySessions, setStudySessions] = useState([])
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksRes, notesRes, subjectsRes, sessionsRes, streakRes, schedulesRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('subjects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('schedules').select('*').eq('user_id', user.id).order('start_time', { ascending: true }),
      ])

      if (tasksRes.data) setTasks(tasksRes.data)
      if (notesRes.data) setNotes(notesRes.data)
      if (subjectsRes.data) setSubjects(subjectsRes.data)
      if (sessionsRes.data) setStudySessions(sessionsRes.data)
      if (streakRes.data) setStreak(streakRes.data)
      if (schedulesRes.data) setSchedules(schedulesRes.data)
    } finally {
      setLoading(false)
    }
  }

  // CRUD METHODS
  const addTask = async (task) => {
    if (!user) return { error: 'Login required' }
    const { data, error } = await supabase.from('tasks').insert([{ ...task, user_id: user.id }]).select()
    if (data) setTasks(prev => [data[0], ...prev])
    return { data, error }
  }

  const updateTask = async (id, updates) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select()
    if (data) setTasks(prev => prev.map(t => t.id === id ? data[0] : t))
    return { data, error }
  }

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
    return { error }
  }

  const addNote = async (note) => {
    if (!user) return { error: 'Login required' }
    const { data, error } = await supabase.from('notes').insert([{ ...note, user_id: user.id }]).select()
    if (data) setNotes(prev => [data[0], ...prev])
    return { data, error }
  }

  const updateNote = async (id, updates) => {
    const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select()
    if (data) setNotes(prev => prev.map(n => n.id === id ? data[0] : n))
    return { data, error }
  }

  const deleteNote = async (id) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) setNotes(prev => prev.filter(n => n.id !== id))
    return { error }
  }

  const addSubject = async (subject) => {
    if (!user) return { error: 'Login required' }
    const { data, error } = await supabase.from('subjects').insert([{ ...subject, user_id: user.id }]).select()
    if (data) setSubjects(prev => [data[0], ...prev])
    return { data, error }
  }

  const deleteSubject = async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (!error) setSubjects(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  // SCHEDULE METHODS
  const addSchedule = async (sched) => {
    if (!user) return { error: 'Login required' }
    const { data, error } = await supabase.from('schedules').insert([{ ...sched, user_id: user.id }]).select()
    if (data) setSchedules(prev => [...prev, data[0]].sort((a,b) => a.start_time.localeCompare(b.start_time)))
    return { data, error }
  }

  const deleteSchedule = async (id) => {
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (!error) setSchedules(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  const addStudySession = async (session) => {
    if (!user) return { error: 'Login required' }
    const { data, error } = await supabase.from('study_sessions').insert([{ ...session, user_id: user.id }]).select()
    if (data) {
      setStudySessions(prev => [data[0], ...prev])
      await updateStreak()
    }
    return { data, error }
  }

  const updateStreak = async () => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    
    if (!streak) {
      const { data } = await supabase.from('streaks').insert([{ user_id: user.id, current_streak: 1, best_streak: 1, last_study_date: today }]).select().single()
      setStreak(data)
    } else {
      if (streak.last_study_date === today) return
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      let newStreak = streak.last_study_date === yesterdayStr ? streak.current_streak + 1 : 1
      const newBest = Math.max(newStreak, streak.best_streak)
      
      const { data } = await supabase.from('streaks').update({ current_streak: newStreak, best_streak: newBest, last_study_date: today }).eq('user_id', user.id).select().single()
      setStreak(data)
    }
  }

  return (
    <DataContext.Provider value={{ 
      tasks, notes, subjects, studySessions, streak, schedules, loading,
      addTask, updateTask, deleteTask, 
      addNote, updateNote, deleteNote, 
      addSubject, deleteSubject, 
      addSchedule, deleteSchedule,
      addStudySession, updateStreak 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
