import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import {
  LayoutDashboard,
  Timer,
  Flame,
  BookOpen,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  GraduationCap,
  Calendar,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/timer', label: 'Study Timer', icon: Timer },
  { path: '/streaks', label: 'Streaks', icon: Flame },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-6 left-6 z-50 lg:hidden p-3 rounded-2xl bg-white dark:bg-surface-900 shadow-xl border border-surface-200 dark:border-surface-800 text-surface-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          bg-[#fcfcff] dark:bg-[#080808]
          border-r border-surface-200/60 dark:border-surface-800/60
          flex flex-col
          transition-all duration-500
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand/Logo Area */}
        <div className={`h-20 flex items-center gap-3 px-6 mb-4 ${collapsed ? 'justify-center border-b border-surface-100 dark:border-surface-800' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/20 group cursor-pointer hover:rotate-3 transition-transform">
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-base font-black text-surface-900 dark:text-white tracking-tight leading-none bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Study Buddy
              </h1>
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-1 block">PLATFORM v1.0</span>
            </div>
          )}
        </div>

        {/* Primary Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-2 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                text-sm font-semibold
                transition-all duration-200 group relative
                ${collapsed ? 'justify-center' : ''}
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-[0_1px_2px_rgba(124,58,237,0.05)]' 
                  : 'text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white'
                }
              `}
            >
              <item.icon size={18} className={`flex-shrink-0 transition-transform ${collapsed ? '' : 'group-hover:scale-110'}`} />
              {!collapsed && <span>{item.label}</span>}
              
              {/* Tooltip for Collapsed View */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-surface-900 dark:bg-surface-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-surface-900 dark:border-r-surface-700" />
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Navigation Actions */}
        <div className="p-3 border-t border-surface-100 dark:border-surface-800 space-y-1">
          <button
            onClick={toggleTheme}
            className={`
              w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
              text-sm font-semibold text-surface-500 dark:text-surface-400
              hover:bg-surface-100 dark:hover:bg-surface-800/50
              hover:text-surface-900 dark:hover:text-white
              transition-all duration-200 cursor-pointer
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            {!collapsed && <span>Appearance</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden lg:flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl
              text-sm font-semibold text-surface-500 dark:text-surface-400
              hover:bg-surface-100 dark:hover:bg-surface-800/50
              hover:text-surface-900 dark:hover:text-white
              transition-all duration-200 cursor-pointer
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Minimize Nav</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
