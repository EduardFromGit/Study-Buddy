import { useState, useEffect, useRef } from 'react'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { Play, Pause, RotateCcw, Zap, Trophy, Clock, Sparkles, ChevronRight, Settings2 } from 'lucide-react'

export default function StudyTimer() {
  const { subjects, addStudySession, updateStreak } = useData()
  const [targetMinutes, setTargetMinutes] = useState(25) // This is the user's custom limit
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [completedSessions, setCompletedSessions] = useState(0)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const timerRef = useRef(null)
  
  // Dynamic calculation based on current target
  const totalSeconds = isBreak ? 5 * 60 : targetMinutes * 60
  const remainingSeconds = minutes * 60 + seconds
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100

  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }, 1000)
    } else if (remainingSeconds === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(timerRef.current)
  }, [isActive, minutes, seconds])

  const handleTimerComplete = async () => {
    setIsActive(false)
    clearInterval(timerRef.current)
    
    new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {})

    if (!isBreak) {
      setCompletedSessions(prev => prev + 1)
      if (selectedSubjectId) {
        await addStudySession({
          subject_id: selectedSubjectId,
          duration: targetMinutes, // Log the actual time spent
        })
        await updateStreak()
      }
      alert('Focus session complete! Time for a short break. 🎉')
      setIsBreak(true)
      setMinutes(5)
      setSeconds(0)
    } else {
      alert('Break over! Ready to focus again? 💪')
      setIsBreak(false)
      setMinutes(targetMinutes)
      setSeconds(0)
    }
  }

  const toggleTimer = () => setIsActive(!isActive)
  
  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setMinutes(targetMinutes)
    setSeconds(0)
  }

  const handlePreset = (mins) => {
    setIsActive(false)
    setIsBreak(false)
    setTargetMinutes(mins)
    setMinutes(mins)
    setSeconds(0)
    setIsCustomizing(false)
  }

  return (
    <div className="max-w-[1200px] mx-auto py-4 sm:py-10 animate-fade-in space-y-16 sm:space-y-24 relative px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-100/20 dark:bg-primary-900/10 blur-[140px] rounded-full -z-10 pointer-events-none" />
      
      {/* Header */}
      <div className="text-center space-y-6 sm:space-y-8 pt-4">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-surface-900 text-primary-600 font-extrabold text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary-500/5">
           <Zap size={14} className="fill-primary-500" />
           <span>Deep Work System</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-surface-900 dark:text-white tracking-tighter leading-tight">
           Master your <span className="text-gradient">Time</span>.
        </h1>
        <p className="text-surface-500 dark:text-surface-400 font-bold max-w-[500px] mx-auto text-base sm:text-lg leading-relaxed opacity-60">
           Customize your focus duration to fit your unique study rhythm and goal requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20 items-start">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
          <Card className="!p-8 sm:!p-10 !rounded-[2.5rem] border-2 border-transparent hover:border-surface-100 dark:hover:border-surface-800 transition-all shadow-2xl shadow-primary-500/5">
             <div className="flex items-center justify-between mb-10 px-1">
                <h2 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white flex items-center gap-4 tracking-tight">
                   <Clock size={22} className="text-primary-600" />
                   Configuration
                </h2>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
             </div>
             
             <div className="space-y-10">
                {/* PRESET SELECTOR */}
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-surface-400 mb-5 ml-1">Focus Target (Minutes)</label>
                   <div className="grid grid-cols-4 gap-3 mb-6">
                      {[15, 25, 45, 60].map(m => (
                        <button
                          key={m}
                          onClick={() => handlePreset(m)}
                          className={`
                            py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer
                            ${targetMinutes === m 
                              ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 ring-2 ring-primary-100 dark:ring-primary-900/10' 
                              : 'bg-surface-50 dark:bg-surface-900 text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100'
                            }
                          `}
                        >
                           {m}m
                        </button>
                      ))}
                   </div>
                   
                   <button 
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-surface-900 text-[11px] font-black uppercase tracking-widest text-surface-400 hover:text-primary-600 transition-all cursor-pointer group"
                   >
                      <div className="flex items-center gap-3">
                         <Settings2 size={16} />
                         <span>Set Custom Duration</span>
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-500 ${isCustomizing ? 'rotate-90' : ''}`} />
                   </button>

                   {isCustomizing && (
                      <div className="mt-4 p-5 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 animate-fade-in">
                         <div className="flex gap-4">
                            <input
                              type="number"
                              min="1"
                              max="180"
                              value={targetMinutes}
                              onChange={(e) => handlePreset(Number(e.target.value))}
                              className="flex-1 bg-white dark:bg-surface-950 border-none rounded-xl py-3 px-5 text-lg font-black text-primary-600 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                              placeholder="0"
                            />
                            <div className="flex items-center pr-4 font-black text-primary-500 text-xs uppercase tracking-widest">Minutes</div>
                         </div>
                      </div>
                   )}
                </div>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-surface-400 mb-4 ml-1">Knowledge Alignment</label>
                   <Select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="!py-4 !rounded-2xl !text-sm !font-bold !bg-surface-50 !border-none"
                  >
                    <option value="">Select a Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Select>
                  {!selectedSubjectId && (
                    <div className="flex items-center gap-2 mt-4 px-2 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/10 text-orange-600 text-[8px] font-black uppercase tracking-[0.2em]">
                       <Sparkles size={10} />
                       Subject selection required for metrics
                    </div>
                  )}
                </div>
                
                <div className="p-8 rounded-[2rem] bg-surface-950 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Streak Progress</p>
                      <p className="text-4xl font-black mt-2 tracking-tighter">{completedSessions} <span className="text-xl text-primary-500 opacity-80">Blocks</span></p>
                   </div>
                   <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                      <Trophy size={32} className="text-amber-500" />
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-3xl -z-0" />
                </div>
             </div>
          </Card>
        </div>

        {/* The Giant Timer Ring */}
        <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2">
          <div className="relative w-72 h-72 sm:w-[500px] sm:h-[500px] group drop-shadow-[0_20px_80px_rgba(124,58,237,0.15)]">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className="stroke-surface-100 dark:stroke-surface-900"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className={`transition-all duration-1000 ease-linear ${isBreak ? 'stroke-emerald-500' : 'stroke-primary-600'}`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="100 100"
                strokeDashoffset={100 - progress}
                pathLength="100"
                fill="none"
              />
            </svg>

            {/* Timer Core Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/20 dark:bg-black/10 m-6 sm:m-16 rounded-full backdrop-blur-[40px] border border-white/30 dark:border-white/5 shadow-inner">
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] mb-6 sm:mb-10 flex items-center gap-2 border ${isBreak ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary-50 text-primary-600 border-primary-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBreak ? 'bg-emerald-500' : 'bg-primary-500'}`} />
                {isBreak ? 'Break Phase' : 'Focus Phase'}
              </div>
              <div className="text-7xl sm:text-[9rem] font-black text-surface-900 dark:text-white font-mono tracking-tighter leading-none mb-10 sm:mb-16 selection:bg-transparent transition-all">
                {String(minutes).padStart(2, '0')}<span className={`inline-block w-4 sm:w-8 transition-opacity duration-500 ${isActive ? 'opacity-20' : ''}`}>:</span>{String(seconds).padStart(2, '0')}
              </div>
              <div className="flex gap-6 sm:gap-10">
                <Button
                  variant={isBreak ? 'success' : 'primary'}
                  size="lg"
                  onClick={toggleTimer}
                  className="!rounded-[2.5rem] w-20 h-20 sm:w-28 sm:h-28 !p-0 shadow-2xl flex items-center justify-center active:scale-90 shadow-primary-500/30 group-hover:scale-105 transition-all"
                >
                  {isActive ? <Pause size={32} sm:size={44} /> : <Play size={32} sm:size={44} className="ml-2 fill-white" />}
                </Button>
                
                <button
                  onClick={resetTimer}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2.5rem] bg-white dark:bg-surface-800 text-surface-400 hover:text-primary-600 border border-surface-200 dark:border-surface-700 flex items-center justify-center transition-all hover:rotate-90 active:scale-90 cursor-pointer shadow-xl shadow-surface-200/20"
                >
                  <RotateCcw size={28} sm:size={36} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Status Meta Data */}
          <div className="mt-16 flex items-center gap-12 sm:gap-20 text-surface-300 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em]">
             <div className="flex flex-col items-center gap-3">
                <Clock size={16} className="text-primary-500 opacity-40" />
                Target: {targetMinutes}m
             </div>
             <div className="flex flex-col items-center gap-3">
                <Trophy size={16} className="text-amber-500 opacity-40" />
                Session: #{completedSessions + 1}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
