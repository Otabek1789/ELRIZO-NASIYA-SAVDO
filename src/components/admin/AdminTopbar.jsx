import { Menu, Sun, Moon, Bell, ArrowLeft, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function AdminTopbar({ title, onMenuClick }) {
  const { lang, setLang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-[5] bg-surface/95 dark:bg-[#16130F]/95 backdrop-blur-md border-b border-line dark:border-[#332C23] px-5 lg:px-[30px] py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] text-ink-soft"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display text-lg sm:text-xl font-bold m-0 text-ink dark:text-[#F3EFE7]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-[#332C23] text-xs font-semibold text-ink-soft hover:text-brand hover:border-brand transition-colors mr-1"
        >
          <ArrowLeft size={13} /> Do'konga qaytish
        </Link>

        {/* Language */}
        <select
          className="appearance-none bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-xl h-9 px-3 text-xs font-bold text-ink dark:text-[#F3EFE7] cursor-pointer"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] text-ink-soft hover:border-brand hover:text-brand transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User avatar badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-line dark:border-[#332C23]">
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="hidden md:inline text-xs font-bold text-ink dark:text-[#F3EFE7]">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </div>
  )
}
