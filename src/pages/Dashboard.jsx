import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import {
  Clock,
  Flame,
  CheckCircle2,
  BookOpen,
  Timer,
  Plus,
  FileText,
  ArrowRight,
  TrendingUp,
  CalendarDays,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { tasks, subjects, studySessions, streak } = useData()

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.due_date === today)
  const completedToday = todayTasks.filter(t => t.status === 'completed').length

  const todaySessions = studySessions.filter(s => 
    s.created_at && s.created_at.startsWith(today)
  )
  const totalStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0)

  const statCards = [
    {
      title: 'Current Focus',
      value: `${totalStudyMinutes}m`,
      subtitle: '/120m target',
      icon: Clock,
      color: 'text-primary-600',
      iconBg: 'bg-primary-50 dark:bg-primary-900/20',
      progress: Math.min((totalStudyMinutes / 120) * 100, 100),
    },
    {
      title: 'Active Streak',
      value: `${streak?.current_streak || 0} days`,
      subtitle: 'Momentum is key',
      icon: Flame,
      color: 'text-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Completion',
      value: `${completedToday}/${todayTasks.length}`,
      subtitle: "Daily milestone",
      icon: CheckCircle2,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Mastery',
      value: subjects.length,
      subtitle: 'Active subjects',
      icon: BookOpen,
      color: 'text-violet-600',
      iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    },
  ]

  return (
    <div className="space-y-16 animate-fade-in max-w-[1240px] mx-auto py-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-[0.25em] mb-4 px-1">
            <Sparkles size={14} className="fill-primary-500" />
            <span>Success Workspace</span>
          </div>
          <h1 className="text-5xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
            Level up your studies, <br className="hidden sm:block" />
            <span className="text-gradient">Welcome back!</span> 👋
          </h1>
        </div>
        
        <div className="flex items-center gap-6 p-4 pr-7 bg-surface-50 dark:bg-surface-900 rounded-3xl border border-surface-200/50 dark:border-surface-800 shadow-sm shadow-surface-200/20 dark:shadow-none">
          <div className="flex -space-x-4">
             {[1,2,3].map(i => (
               <div key={i} className="w-11 h-11 rounded-full border-4 border-surface-50 dark:border-surface-900 bg-surface-100 dark:bg-surface-800 overflow-hidden flex items-center justify-center transition-transform hover:translate-y-[-2px] cursor-pointer">
                 <span className="text-xs font-black text-surface-400">{i}</span>
               </div>
             ))}
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-black text-surface-900 dark:text-white leading-none">128 others</p>
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-1">studying now</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="!p-8 hover-lift group border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.color} mb-8 transition-transform group-hover:scale-110`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2 leading-none">
                {stat.title}
              </p>
              <p className="text-3xl font-black text-surface-900 dark:text-white tracking-tighter mb-1 leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] font-bold text-surface-500 mt-2">
                {stat.subtitle}
              </p>
            </div>
            {stat.progress !== undefined && (
              <div className="mt-8">
                <div className="w-full h-2.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden p-0.5 border border-surface-200/50 dark:border-surface-700">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-1000 shadow-sm shadow-primary-500/20"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Primary Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            title: 'Deep Focus',
            subtitle: 'Start focus block',
            icon: Timer,
            color: 'from-primary-600 to-indigo-700',
            path: '/timer',
            badge: 'Focus'
          },
          {
            title: 'Task Library',
            subtitle: 'Master your list',
            icon: Plus,
            color: 'from-emerald-600 to-teal-700',
            path: '/tasks',
            badge: 'Plan'
          },
          {
            title: 'Knowledge',
            subtitle: 'Capture wisdom',
            icon: FileText,
            color: 'from-orange-500 to-rose-600',
            path: '/notes',
            badge: 'Write'
          },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className={`
              relative group overflow-hidden p-10 rounded-[2.5rem] text-white text-left
              bg-gradient-to-br ${action.color}
              hover:shadow-2xl hover:shadow-primary-600/20 hover:scale-[1.03]
              active:scale-[0.98]
              transition-all duration-500 cursor-pointer
              animate-slide-up delay-${i + 1}
            `}
          >
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                {action.badge}
              </span>
              <h3 className="font-black text-2xl tracking-tighter leading-none">{action.title}</h3>
              <p className="text-white/70 text-sm font-semibold mt-3">{action.subtitle}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700 blur-[2px]">
              <action.icon size={160} strokeWidth={1} />
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Task List Subsection */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="!p-10 !rounded-[2.5rem] border-2 border-transparent hover:border-surface-100 dark:hover:border-surface-800 transition-all">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight flex items-center gap-4">
                <CalendarDays size={26} className="text-primary-600" />
                Deadlines
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className="group pr-2 py-2 text-xs font-black uppercase tracking-widest text-surface-400 hover:text-primary-600 transition-all cursor-pointer flex items-center gap-3"
              >
                View Library <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="bg-surface-50 dark:bg-surface-900/50 rounded-[2rem] p-16 text-center border-2 border-dashed border-surface-200/50 dark:border-surface-800/50 group hover:border-primary-500/20 transition-all">
                <div className="w-20 h-20 bg-white dark:bg-surface-900 rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Sparkles size={32} className="text-primary-400" />
                </div>
                <p className="text-xl font-black text-surface-900 dark:text-white tracking-tight">Nothing due today!</p>
                <p className="text-surface-500 font-bold text-sm mt-3 opacity-70">Focus on building your knowledge library or planning tomorrow.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {todayTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="group flex items-center gap-6 p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800/60 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 hover:translate-y-[-2px] transition-all cursor-pointer">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className={`text-lg font-black tracking-tight leading-none flex-1 truncate ${task.status === 'completed' ? 'line-through text-surface-300' : 'text-surface-800 dark:text-white'}`}>
                      {task.title}
                    </span>
                    <Badge variant={task.priority === 'high' ? 'danger' : 'default'} className="!px-4 !py-1.5 !rounded-lg !opacity-80">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info Section */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="!p-10 !rounded-[2.5rem] bg-surface-900 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[220px]">
              <div>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                  Pro Tip <Sparkles size={18} className="text-primary-400 fill-primary-400" />
                </h2>
                <p className="text-surface-400 text-base font-bold leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                  Try the "Pomodoro" method: Study for 25 minutes, then take a 5-minute break to keep your mind fresh.
                </p>
              </div>
              <button 
                onClick={() => navigate('/timer')}
                className="inline-flex items-center gap-3 text-primary-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all cursor-pointer group/btn"
              >
                Go to Timer <ChevronRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-600/20 blur-[64px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
          </Card>
          
          <div className="p-10 rounded-[2.5rem] border border-surface-100 dark:border-surface-800/50 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-6">
                <TrendingUp size={28} />
             </div>
             <p className="text-sm font-black text-surface-900 dark:text-white mb-2 leading-none">Cognitive Peak</p>
             <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Weds at 10:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
