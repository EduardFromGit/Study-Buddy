import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="w-20 h-20 rounded-[2rem] bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6">
          <Icon size={36} className="text-surface-300 dark:text-surface-600" />
        </div>
      )}
      <h3 className="text-xl font-black text-surface-900 dark:text-white mb-2">{title}</h3>
      <p className="text-surface-500 dark:text-surface-400 max-w-sm font-medium">{description}</p>
      {action && (
        <Button onClick={onAction} className="mt-8 !rounded-2xl">
          {action}
        </Button>
      )}
    </div>
  )
}
