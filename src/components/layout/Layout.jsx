import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] selection:bg-primary-100 selection:text-primary-900">
      <Sidebar />
      <main className="lg:ml-[240px] min-h-screen transition-all duration-500 ease-in-out">
        <div className="p-8 pt-24 lg:p-14 lg:pt-14 max-w-[1400px] mx-auto min-h-screen space-y-12 animate-fade-in relative">
          {/* Subtle Ambient Background Bloom */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 dark:bg-primary-900/10 blur-[120px] rounded-full -z-10 animate-float pointer-events-none" />
          
          <Outlet />
        </div>
      </main>
    </div>
  )
}
