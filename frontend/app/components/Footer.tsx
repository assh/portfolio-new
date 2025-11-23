import {studioUrl} from '@/sanity/lib/api'
import {resumeBasicsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Footer() {
  const {data: resume} = await sanityFetch({
    query: resumeBasicsQuery,
  })

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="container space-y-10 px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold">{resume?.fullName || 'Your name here'}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.3em] text-white/70">{resume?.headline || ''}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Based in</p>
            <p className="mt-2 text-lg text-white/90">{resume?.location || 'Anywhere on the internet'}</p>
            <p className="mt-4 text-sm text-white/70">
              Updates made in the private editor sync with this site instantly thanks to the Live Content API.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-900 transition-colors duration-200 hover:bg-gray-200"
            >
              Open editor
            </a>
            <p className="text-sm text-white/70">Launch the Presentation tool and update any section with on-page drafts.</p>
          </div>
        </div>
        <p className="border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-white/50">
          © {new Date().getFullYear()} {resume?.fullName || 'Portfolio'} · Crafted with live Visual Editing workflows
        </p>
      </div>
    </footer>
  )
}
