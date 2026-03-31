const variants = {
  primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.1),0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.1),0_8px_24px_rgba(124,58,237,0.3)]',
  secondary: 'bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-700 shadow-sm',
  success: 'bg-success-500 hover:bg-success-600 text-white shadow-lg shadow-success-500/20',
  danger: 'bg-white dark:bg-surface-800 hover:bg-danger-50 dark:hover:bg-danger-900/20 text-danger-600 border border-danger-200 dark:border-danger-900/30',
  ghost: 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconRight: IconRight,
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2.5 
        font-semibold rounded-2xl
        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        focus:outline-none focus:ring-4 focus:ring-primary-500/10
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.96]
        cursor-pointer
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />
      ) : null}
      <span className="truncate">{children}</span>
      {!loading && IconRight && (
        <IconRight 
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} 
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </button>
  )
}
