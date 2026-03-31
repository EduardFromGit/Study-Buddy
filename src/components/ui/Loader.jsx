export default function Loader({ fullScreen = false }) {
  const loader = <div className="loader" />

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {loader}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20 w-full animate-fade-in">
      {loader}
    </div>
  )
}
