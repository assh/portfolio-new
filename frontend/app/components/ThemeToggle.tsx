'use client'

import {useEffect, useState} from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'portfolio-theme'

const themeSequence: Theme[] = ['system', 'light', 'dark']

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme) {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const resolved = resolveTheme(theme)
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

function getNextTheme(current: Theme): Theme {
  const index = themeSequence.indexOf(current)
  const nextIndex = index === -1 ? 0 : (index + 1) % themeSequence.length
  return themeSequence[nextIndex]
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const preferred = getPreferredTheme()
    setTheme(preferred)
    setMounted(true)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyTheme('system')
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => {
      const next = getNextTheme(current)
      applyTheme(next)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
      return next
    })
  }

  const resolvedTheme = resolveTheme(theme)
  const label = `Activate ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-gray-500"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {mounted ? (
        theme === 'system' ? (
          <SystemIcon />
        ) : resolvedTheme === 'dark' ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )
      ) : (
        <SystemIcon />
      )}
      <span className="ml-2 text-[0.6rem] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
        {theme}
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 6.95-1.41-1.41M6.46 6.46 5.05 5.05m0 13.9 1.41-1.41m13.9-13.9-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 15.5A8.5 8.5 0 0 1 9.5 4 6.5 6.5 0 1 0 21 15.5Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="4" />
      <path d="M4 12h4M16 12h4M12 4v4M12 16v4m-5.657-9.657 2.828 2.828m5.657-5.657 2.828 2.828m0 0-2.828 2.829m-5.657-5.657-2.828 2.828" />
    </svg>
  )
}
