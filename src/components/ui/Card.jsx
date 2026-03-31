export default function Card({ children, className = '', hover = false, padding = 'p-6', ...props }) {
  return (
    <div
      className={`
        bg-white dark:bg-surface-900
        rounded-3xl
        border border-surface-200/80 dark:border-surface-800/80
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)]
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-surface-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}
