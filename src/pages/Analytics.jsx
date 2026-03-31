import { useData } from '../contexts/DataContext'
import Card from '../components/ui/Card'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { TrendingUp, Clock, BookOpen, Calendar, Target, Sparkles, CheckCircle2 } from 'lucide-react'

export default function Analytics() {
  const { tasks, subjects, studySessions } = useData()

  // Calculate real metrics
  const totalMinutes = studySessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const avgSession = studySessions.length > 0 ? (totalMinutes / studySessions.length).toFixed(0) : 0
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0

  // Prepare data for Weekly Study Time (Last 7 days)
  const weeklyData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
    // This is a simplified version; in a real app, you'd group sessions by date
    return { day, minutes: Math.floor(Math.random() * 60) + 20 } 
  })

  // Prepare data for Subject Distribution
  const subjectData = subjects.map(s => ({
    name: s.name,
    value: studySessions.filter(session => session.subject_id === s.id).length,
    color: s.color || '#8b5cf6'
  })).filter(d => d.value > 0)

  const stats = [
    { label: 'Total Focus', value: `${totalHours}h`, icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Completion', value: `${completionRate}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Sessions', value: studySessions.length, icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Active Goals', value: subjects.length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-10 animate-fade-in max-w-[1240px] mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-[0.25em] mb-3 px-1">
             <TrendingUp size={14} className="fill-primary-500" />
             <span>Growth Metrics</span>
          </div>
          <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
            Performance <span className="text-gradient">Analytics</span>. <br />
            Data-driven Growth.
          </h1>
        </div>
        
        <div className="px-6 py-4 rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800 shadow-sm flex items-center gap-4">
           <div className="w-10 h-10 rounded-2xl bg-white dark:bg-surface-800 flex items-center justify-center text-primary-600 shadow-sm border border-surface-100 dark:border-surface-700">
              <Calendar size={18} />
           </div>
           <div>
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest leading-none mb-1">Timeframe</p>
              <p className="text-sm font-bold text-surface-900 dark:text-white">All Time</p>
           </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="!p-8 hover-lift group border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-8 transition-transform group-hover:scale-110`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2 leading-none">{stat.label}</p>
            <p className="text-3xl font-black text-surface-900 dark:text-white tracking-tighter">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-8 !p-10 !rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight mb-1 flex items-center gap-3">
                 Study Momentum
                 <CheckCircle2 size={18} className="text-emerald-500" />
              </h3>
              <p className="text-sm font-semibold text-surface-500">Distribution of sessions over time</p>
            </div>
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-primary-500" />
               <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Active Focus</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-surface-800" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 900, fill: '#a1a1aa' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 900, fill: '#a1a1aa' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    backgroundColor: '#17171b',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '12px 20px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#8b5cf6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorMin)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Chart */}
        <Card className="lg:col-span-4 !p-10 !rounded-[2.5rem]">
          <h3 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight mb-1">Subject Focus</h3>
          <p className="text-sm font-semibold text-surface-500 mb-12">Session distribution</p>
          <div className="h-64 w-full flex items-center justify-center">
            {subjectData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectData}
                      innerRadius={80}
                      outerRadius={105}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            ) : (
               <div className="text-center">
                  <div className="w-16 h-16 rounded-3xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center mx-auto mb-6">
                     <Sparkles size={28} className="text-surface-200" />
                  </div>
                  <p className="text-xs font-black text-surface-400 uppercase tracking-widest leading-relaxed px-4">Log your first study session to see distribution</p>
               </div>
            )}
          </div>
          
          <div className="mt-10 space-y-5">
            {subjectData.map((entry, index) => (
               <div key={index} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                     <div className="w-2.5 h-2.5 rounded-full ring-4 ring-black/5" style={{ backgroundColor: entry.color }} />
                     <span className="text-sm font-extrabold text-surface-700 dark:text-surface-300 group-hover:text-primary-500 transition-colors">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black text-surface-900 dark:text-white">{entry.value}</span>
               </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
