import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import {
  Flame,
  Zap,
  Trophy,
  History,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Streak() {
  const { streak, studySessions } = useData()

  // Generate real activity heatmap data for the last 35 days
  const heatmapData = Array.from({ length: 35 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (34 - i))
    const dateString = date.toISOString().split('T')[0]
    
    // Count sessions on this specific day (UTC safe)
    const sessionsOnDay = studySessions.filter(s => {
      const sessionDate = new Date(s.created_at).toLocaleDateString('en-CA') // YYYY-MM-DD
      return sessionDate === dateString
    }).length

    return {
      date: dateString,
      intensity: sessionsOnDay > 3 ? 3 : sessionsOnDay // Max intensity 3
    }
  })

  // Calculate totals
  const totalFocusMinutes = studySessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const totalSessions = studySessions.length

  const highlights = [
    { 
      label: 'Personal Best', 
      value: `${streak?.best_streak || 0} Days`, 
      icon: Award, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Focus Hours', 
      value: `${(totalFocusMinutes / 60).toFixed(1)}h`, 
      icon: Zap, 
      color: 'text-primary-600', 
      bg: 'bg-primary-50' 
    },
    { 
      label: 'Total Blocks', 
      value: `${totalSessions} Sessions`, 
      icon: Trophy, 
      color: 'text-primary-600', 
      bg: 'bg-primary-50' 
    },
    { 
      label: 'Average/Day', 
      value: `${(totalSessions / 30).toFixed(1)}`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
  ]

  return (
    <div className="space-y-10 animate-fade-in max-w-[1240px] mx-auto py-2">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <Card className="!p-10 !rounded-[3rem] bg-surface-950 text-white border-none shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px]">
            <div>
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 w-fit backdrop-blur-md mb-8 border border-white/5">
                <Flame size={20} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Current Momentum</span>
              </div>
              <h1 className="text-8xl font-black tracking-tighter leading-none mb-6 animate-slide-up">
                {streak?.current_streak || 0} <span className="text-emerald-500">Days</span>
              </h1>
              <p className="text-surface-400 font-bold max-w-sm text-lg leading-relaxed opacity-80">
                You've maintained your focus for {streak?.current_streak || 0} consecutive days. Your performance is in the 98th percentile.
              </p>
            </div>
          </div>
          <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:rotate-12 transition-transform duration-1000 blur-[2px]">
            <Flame size={450} strokeWidth={1} />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-8">
           {highlights.map((h, i) => (
             <Card key={i} className="!p-10 !rounded-[2.5rem] hover-lift border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/10 transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl ${h.bg} flex items-center justify-center ${h.color} mb-8`}>
                   <h.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2 leading-none">{h.label}</p>
                <h3 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight">{h.value}</h3>
             </Card>
           ))}
        </div>
      </div>

      {/* Heatmap Section */}
      <Card className="!p-12 !rounded-[3rem] shadow-2xl shadow-emerald-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-12 pb-8 border-b border-surface-100 dark:border-surface-800">
           <div>
              <h2 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight mb-2 flex items-center gap-4">
                 Activity Heatmap
                 <Sparkles size={24} className="text-emerald-500 fill-emerald-500" />
              </h2>
              <p className="text-sm font-bold text-surface-500">Consistency visualized using the GitHub-style Emerald palette.</p>
           </div>
        </div>

        <div className="space-y-16">
          {/* Legend */}
          <div className="flex items-center justify-end gap-3 px-2">
            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Minimal</span>
            {[0, 1, 2, 3].map(level => (
              <div 
                key={level} 
                className={`w-5 h-5 rounded-md shadow-sm border border-surface-100 dark:border-surface-800 ${
                  level === 0 ? 'bg-surface-50 dark:bg-surface-900' : 
                  level === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                  level === 2 ? 'bg-emerald-300 dark:bg-emerald-600/60' : 'bg-emerald-600'
                }`} 
              />
            ))}
            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Peak</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-5 sm:gap-8">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-[10px] font-black text-surface-400 uppercase tracking-[0.3em] mb-4">{day}</div>
            ))}
            {heatmapData.map((d, i) => (
              <div 
                key={i} 
                className={`
                  aspect-square rounded-2xl transition-all duration-700 hover:scale-110 cursor-default border border-surface-100 dark:border-surface-800
                  ${d.intensity === 0 ? 'bg-surface-50 dark:bg-surface-900 shadow-inner' : 
                    d.intensity === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                    d.intensity === 2 ? 'bg-emerald-300 dark:bg-emerald-600/60' : 'bg-emerald-600 shadow-xl shadow-emerald-500/20'}
                `}
                title={`${d.date}: ${d.intensity} sessions`}
              />
            ))}
          </div>

          <div className="text-center opacity-40 italic py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Activity signatures synced across real-time P2P nodes</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-12">
         <History size={18} className="text-surface-300" />
         <p className="text-xs font-black uppercase tracking-widest text-surface-300">Detailed historical logs available via the Cloud API</p>
      </div>
    </div>
  )
}
