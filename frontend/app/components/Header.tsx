import Link from 'next/link'

import ThemeToggle from '@/app/components/ThemeToggle'
import {resumeBasicsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

const navItems = [
  {href: '#about', label: 'About'},
  {href: '#experience', label: 'Experience'},
  {href: '#projects', label: 'Projects'},
  {href: '#skills', label: 'Skills'},
  {href: '#credentials', label: 'Credentials'},
]

type ResumeBasics = {
  fullName?: string
  headline?: string
}

export default async function Header() {
  const {data} = await sanityFetch({
    query: resumeBasicsQuery,
  })
  const resume = (data ?? null) as ResumeBasics | null

  return (
    <header className="fixed inset-0 z-50 h-24 bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
      <div className="container flex h-full items-center justify-between gap-6 px-2 py-6 sm:px-6">
        <Link className="flex flex-col leading-tight" href="/">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
            {resume?.fullName || 'My Portfolio'}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 sm:text-sm">
            {resume?.headline || 'Designing reliable software'}
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300 sm:gap-4 sm:text-[0.7rem] md:text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a className="hover:text-black focus-visible:text-black dark:hover:text-white dark:focus-visible:text-white" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
            <li>
              <a
                href="#experience"
                className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-blue sm:px-6 sm:text-xs"
              >
                View work
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
