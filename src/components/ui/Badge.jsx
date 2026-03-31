const variants = {
  default: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-xl
      text-[10px] font-black uppercase tracking-widest
      ${variants[variant] || variants.default}
      ${className}
    `}>
      {children}
    </span>
  )
}
