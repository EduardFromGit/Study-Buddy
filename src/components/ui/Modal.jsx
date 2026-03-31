import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 animate-fade-in">
      {/* Dynamic Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-[15px] transition-all duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className={`
        relative w-full ${maxWidth} bg-white dark:bg-surface-900 
        rounded-[2.5rem] shadow-[0_45px_100px_-20px_rgba(139,92,246,0.15)] 
        border border-white/50 dark:border-surface-800
        overflow-hidden animate-slide-up-modals transition-all duration-500
      `}>
        
        {/* Header Decor */}
        <div className="h-1 bg-gradient-to-r from-primary-400 via-violet-500 to-indigo-600 opacity-80" />

        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100 dark:border-primary-900/10">
                   <Sparkles size={24} className="fill-primary-500" />
                </div>
                <div>
                   {title && (
                    <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
                       {title}
                    </h2>
                   )}
                   <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-1">Workspace Resource</p>
                </div>
             </div>
             <button
               onClick={onClose}
               className="p-3 rounded-2xl text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800 transition-all cursor-pointer shadow-sm border border-transparent hover:border-surface-100 dark:hover:border-surface-700"
             >
               <X size={20} />
             </button>
          </div>

          <div className="custom-scrollbar max-h-[70vh] overflow-y-auto pr-2 -mr-2">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
