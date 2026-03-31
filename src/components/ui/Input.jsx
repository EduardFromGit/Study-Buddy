import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-2xl border border-surface-200 dark:border-surface-800
            bg-surface-50 dark:bg-surface-800/50
            text-surface-900 dark:text-white
            placeholder:text-surface-400 dark:placeholder:text-surface-600
            focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
            focus:bg-white dark:focus:bg-surface-800
            transition-all duration-300
            ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5
            text-sm font-medium
            ${error ? 'border-danger-500 focus:ring-danger-500/10 focus:border-danger-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-xs text-danger-500 ml-1 font-medium">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
