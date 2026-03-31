import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

const Select = forwardRef(({ label, error, className = '', children, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-2xl
            border border-surface-200 dark:border-surface-800
            bg-surface-50 dark:bg-surface-800/50
            text-surface-900 dark:text-white
            focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
            focus:bg-white dark:focus:bg-surface-800
            transition-all duration-300
            pl-5 pr-12 py-3.5
            text-sm font-medium cursor-pointer
            ${error ? 'border-danger-500' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger-500 ml-1 font-medium">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
