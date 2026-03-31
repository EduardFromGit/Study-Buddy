import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudyTimer from './pages/StudyTimer'
import Streak from './pages/Streak'
import Subjects from './pages/Subjects'
import Notes from './pages/Notes'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Schedule from './pages/Schedule'
import Loader from './components/ui/Loader'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
      <Loader />
    </div>
  )
  
  if (!user) return <Navigate to="/login" />
  
  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-10 ml-0 lg:ml-72 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Trigger loader on navigation
    setIsNavigating(true)
    const timeout = setTimeout(() => {
      setIsNavigating(false)
    }, 800) // 800ms for the "transition" feel

    return () => clearTimeout(timeout)
  }, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/timer" element={<ProtectedRoute><StudyTimer /></ProtectedRoute>} />
        <Route path="/streaks" element={<ProtectedRoute><Streak /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      {isNavigating && <Loader fullScreen={true} />}
    </>
  )
}
