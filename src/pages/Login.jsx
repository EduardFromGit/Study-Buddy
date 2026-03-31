import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { GraduationCap, Mail, Lock, ArrowRight, BookOpen, Clock, Flame, ChevronRight } from 'lucide-react'

export default function Login() {
  const { user, signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Check your email for the confirmation link!')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (err) {
      if (err.message.includes('429')) {
        setError('Too many attempts. Please wait a few minutes.')
      } else {
        setError(err.message || 'An error occurred')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-surface-900 selection:bg-primary-100 selection:text-primary-900 overflow-y-auto lg:overflow-hidden">
      {/* Left side - Branded Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-primary-600 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-400/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full bg-primary-800/50 blur-[80px]" />
        
        <div className="relative z-10 w-full max-w-sm">
          {/* Floating Glass Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <GraduationCap size={32} className="text-primary-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
              Master your <br />
              <span className="text-primary-200">Study Flow.</span>
            </h1>
            
            <p className="text-primary-100/80 text-lg leading-relaxed mb-10">
              Your personal workspace for organized notes, time tracking, and academic growth.
            </p>

            <div className="space-y-4">
              {[
                { icon: BookOpen, text: 'Clean, subject-based notes' },
                { icon: Clock, text: 'Integrated focus timer' },
                { icon: Flame, text: 'Visual streak tracking' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-primary-200/60 text-xs font-semibold uppercase tracking-widest px-4">
            <div className="h-px flex-1 bg-primary-400/30" />
            <span>Built for Excellence</span>
            <div className="h-px flex-1 bg-primary-400/30" />
          </div>
        </div>
      </div>

      {/* Right side - Form Panel */}
      <div className="flex-1 flex flex-col items-center px-6 py-12 lg:px-20 lg:justify-center">
        <div className="w-full max-w-[400px]">
          {/* Brand Header (Mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/25">
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">Study Buddy</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-2">
              {isSignUp ? 'Join Study Buddy' : 'Welcome back'}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg">
              {isSignUp ? 'Create your platform account' : 'Sign in to your study workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 ml-1">
                Email Address
              </label>
              <Input
                icon={Mail}
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="!py-3.5 !rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                  Password
                </label>
                {!isSignUp && (
                  <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                    Forgot?
                  </button>
                )}
              </div>
              <Input
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="!py-3.5 !rounded-2xl"
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-danger-50 dark:bg-danger-500/10 border border-danger-100 dark:border-danger-900/30 flex items-start gap-3 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-danger-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-2xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-900/30 text-sm text-success-600 dark:text-success-400 font-medium animate-fade-in">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full !rounded-2xl !py-4 text-base font-semibold group shadow-xl hover:shadow-primary-600/20 active:scale-[0.98] transition-all"
              loading={loading}
              iconRight={ChevronRight}
            >
              {isSignUp ? 'Create Workspace' : 'Continue to Dashboard'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-100 dark:border-surface-800 text-center">
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {isSignUp ? 'Already have a workspace?' : "Thinking about joining?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
                className="text-primary-600 hover:text-primary-700 font-bold ml-1 hover:underline underline-offset-4 transition-all"
              >
                {isSignUp ? 'Log in' : 'Start for free'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-10 text-surface-400 text-[10px] uppercase tracking-widest font-bold">
          © 2026 Study Buddy Platform · Privacy · Terms
        </div>
      </div>
    </div>
  )
}
