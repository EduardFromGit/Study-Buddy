import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import {
  User,
  Moon,
  Sun,
  LogOut,
  Mail,
  Shield,
  Bell,
  Palette,
  Database,
  Info,
} from 'lucide-react'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setLoading(true)
      await signOut()
      setLoading(false)
    }
  }

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <Input
            label="Email"
            icon={Mail}
            value={user?.email || 'Not signed in'}
            disabled
          />
          <Input
            label="User ID"
            icon={Shield}
            value={user?.id?.substring(0, 20) + '...' || 'N/A'}
            disabled
          />
          <p className="text-xs text-surface-400">
            Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      ),
    },
    {
      title: 'Appearance',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={20} className="text-primary-400" /> : <Sun size={20} className="text-warning-500" />}
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-surface-400">
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`
                relative w-12 h-6 rounded-full transition-colors cursor-pointer
                ${isDark ? 'bg-primary-600' : 'bg-surface-300'}
              `}
            >
              <div className={`
                absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform
                ${isDark ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Data & Privacy',
      icon: Database,
      content: (
        <div className="space-y-3">
          <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Your data is stored securely</p>
                <p className="text-xs text-surface-400 mt-1">
                  All your study data is stored in Supabase with Row Level Security (RLS) enabled. 
                  Only you can access your own data.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'About',
      icon: Info,
      content: (
        <div className="space-y-2">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            <span className="font-medium text-surface-900 dark:text-white">Study Buddy</span> v1.0.0
          </p>
          <p className="text-xs text-surface-400">
            A productivity web app for students. Manage tasks, organize notes, track study sessions, and maintain streaks.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Settings sections */}
      {settingsSections.map((section, i) => (
        <Card key={i} className={`animate-fade-in delay-${i + 1}`}>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <section.icon size={18} className="text-primary-500" />
            </div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">{section.title}</h2>
          </div>
          {section.content}
        </Card>
      ))}

      {/* Logout */}
      <Card className="border-danger-200 dark:border-danger-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">Sign Out</h2>
            <p className="text-xs text-surface-400 mt-0.5">Sign out of your Study Buddy account</p>
          </div>
          <Button
            variant="danger"
            icon={LogOut}
            onClick={handleLogout}
            loading={loading}
          >
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  )
}
