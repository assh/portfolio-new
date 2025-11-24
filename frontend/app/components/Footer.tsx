import {studioUrl} from '@/sanity/lib/api'
import {resumeBasicsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

type ResumeBasics = {
  fullName?: string
  headline?: string
  location?: string
}

export default async function Footer() {
  const {data} = await sanityFetch({
    query: resumeBasicsQuery,
  })
  const resume = (data ?? null) as ResumeBasics | null

  return (
    <footer id="contact" className="bg-gray-900 text-white transition-colors duration-300 dark:bg-black">
      <div className="container space-y-10 px-4 py-16 text-white sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold">{resume?.fullName || 'Your name here'}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.3em] text-white/70">{resume?.headline || ''}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Based in</p>
            <p className="mt-2 text-lg text-white/90">{resume?.location || 'Anywhere on the internet'}</p>
          </div>
        </div>
        <p className="border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-white/60">
          © {new Date().getFullYear()} {resume?.fullName || 'Portfolio'}
        </p>
      </div>
    </footer>
  )
}
