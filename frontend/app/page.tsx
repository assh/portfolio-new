import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {differenceInYears, format, parseISO} from 'date-fns'

import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {resumeQuery} from '@/sanity/lib/queries'

type NarrativeValue = PortableTextBlock[]

type ImpactHighlight = {
  _key: string
  body: string
  metricValue?: string
  metricDescription?: string
}

type TimePeriod = {
  startDate?: string
  endDate?: string
}

type Experience = {
  _id: string
  role?: string
  organization?: string
  location?: string
  employmentType?: 'fullTime' | 'partTime' | 'contract' | 'internship'
  industryFocus?: string
  summary?: NarrativeValue
  period?: TimePeriod
  engagementStatus?: 'current' | 'completed'
  highlights?: ImpactHighlight[]
  tooling?: string[]
}

type Project = {
  _id: string
  title?: string
  role?: string
  objective?: string
  summary?: NarrativeValue
  period?: TimePeriod
  status?: 'planned' | 'inProgress' | 'completed'
  technologies?: string[]
  links?: {_key: string; label?: string; url?: string}[]
  highlights?: ImpactHighlight[]
}

type Education = {
  _id: string
  degree?: string
  institution?: string
  location?: string
  studyType?: 'fullTime' | 'partTime' | 'distance'
  period?: TimePeriod
  classStanding?: string
  modules?: string[]
  summary?: NarrativeValue
}

type Publication = {
  _id: string
  title?: string
  publisher?: string
  location?: string
  category?: 'conference' | 'journal' | 'chapter' | 'article'
  publishedAt?: string
  summary?: string
  citation?: string
  links?: {_key: string; label?: string; url?: string}[]
}

type Certification = {
  _id: string
  name?: string
  issuer?: string
  location?: string
  issuedAt?: string
  credentialId?: string
  verificationUrl?: string
}

type SkillCategory = {
  _id: string
  label?: string
  skills?: string[]
}

type LanguageDoc = {
  _id: string
  name?: string
  proficiency?: 'native' | 'fluent' | 'professional' | 'conversational'
}

type Resume = {
  fullName?: string
  headline?: string
  location?: string
  summary?: NarrativeValue
  experiences?: Experience[]
  projects?: Project[]
  education?: Education[]
  certifications?: Certification[]
  publications?: Publication[]
  skillCategories?: SkillCategory[]
  languages?: LanguageDoc[]
}

const employmentLabels: Record<NonNullable<Experience['employmentType']>, string> = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
}

const projectStatusLabels: Record<NonNullable<Project['status']>, string> = {
  planned: 'Planned',
  inProgress: 'In progress',
  completed: 'Completed',
}

const studyLabels: Record<NonNullable<Education['studyType']>, string> = {
  fullTime: 'Full-time studies',
  partTime: 'Part-time studies',
  distance: 'Distance learning',
}

const proficiencyLabels: Record<NonNullable<LanguageDoc['proficiency']>, string> = {
  native: 'Native',
  fluent: 'Fluent',
  professional: 'Professional',
  conversational: 'Conversational',
}

const publicationCategoryLabels: Record<NonNullable<Publication['category']>, string> = {
  conference: 'Conference',
  journal: 'Journal',
  chapter: 'Book chapter',
  article: 'Article',
}

const narrativeComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="leading-relaxed text-balance">{children}</p>,
    h2: ({children}) => <h2 className="text-xl font-semibold text-gray-900">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-semibold text-gray-900">{children}</h3>,
  },
  marks: {
    link: ({children, value}) => {
      const href = (value as {href?: string} | undefined)?.href
      if (!href) {
        return children
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-700 underline decoration-dotted underline-offset-4"
        >
          {children}
        </a>
      )
    },
  },
}

export default async function Page() {
  const {data: resume} = await sanityFetch<Resume | null>({
    query: resumeQuery,
  })

  if (!resume) {
    return <EmptyState />
  }

  const experiences = resume.experiences || []
  const projects = resume.projects || []
  const education = resume.education || []
  const certifications = resume.certifications || []
  const publications = resume.publications || []
  const skillCategories = resume.skillCategories || []
  const languages = resume.languages || []

  const yearsOfExperience = calculateYearsOfExperience(experiences)

  const stats = [
    {
      label: 'Years shipping',
      value: yearsOfExperience ? `${yearsOfExperience}+` : experiences.length ? `${experiences.length} roles` : '—',
    },
    {label: 'Featured projects', value: projects.length ? projects.length.toString().padStart(2, '0') : '—'},
    {label: 'Publications', value: publications.length ? publications.length.toString().padStart(2, '0') : '—'},
    {label: 'Languages', value: languages.length ? languages.length.toString().padStart(2, '0') : '—'},
  ]

  return (
    <>
      <section
        id="about"
        className="container grid gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:pt-16"
      >
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">Portfolio in real time</p>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {resume.fullName || 'Your name here'}
            </h1>
            <p className="mt-3 text-2xl font-light text-gray-600 sm:text-3xl">
              {resume.headline || 'Showcase your expertise with live, editable content.'}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-gray-500">
              {resume.location || 'Location managed in your CMS'}
            </p>
          </div>
          <NarrativeCopy className="text-lg text-gray-700" value={resume.summary} />
          <div className="flex flex-wrap gap-3">
            <a
              href="#experience"
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors duration-200 hover:bg-blue"
            >
              View experience
            </a>
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-900 transition-colors duration-200 hover:border-gray-900"
            >
              Edit content
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">Snapshot</p>
          <ul className="mt-6 grid gap-6">
            {stats.map((stat) => (
              <li key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.4em] text-gray-500">{stat.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-600">
            Every detail is managed in your private editing workspace. Visual Editing keeps this page live as you draft new copy.
          </p>
        </div>
      </section>

      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <SkillsSection skillCategories={skillCategories} languages={languages} />
      <CredentialsSection
        education={education}
        certifications={certifications}
        publications={publications}
      />
    </>
  )
}

function ExperienceSection({experiences}: {experiences: Experience[]}) {
  if (!experiences.length) {
    return null
  }

  return (
    <section id="experience" className="bg-gray-50">
      <div className="container px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          eyebrow="Making impact"
          title="Experience"
          description="Detailed case studies that highlight measurable outcomes across leadership, IC, and consulting engagements."
        />
        <div className="mt-12 space-y-8">
          {experiences.map((experience) => (
            <article key={experience._id} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                    {experience.employmentType ? employmentLabels[experience.employmentType] : 'Experience'}
                    {experience.industryFocus ? ` • ${experience.industryFocus}` : ''}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900">{experience.role}</h3>
                  <p className="text-sm text-gray-600">
                    {[experience.organization, experience.location].filter(Boolean).join(' • ')}
                  </p>
                </div>
                <div className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500">
                  {formatPeriod(experience.period)}
                </div>
              </div>
              <NarrativeCopy className="mt-6 text-base text-gray-700" value={experience.summary} />
              <HighlightsList className="mt-6" highlights={experience.highlights} />
              {experience.tooling?.length ? (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Tooling</p>
                  <TagList className="mt-3" items={experience.tooling} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection({projects}: {projects: Project[]}) {
  if (!projects.length) {
    return null
  }

  return (
    <section id="projects" className="container px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects"
        description="Product explorations, platform rewrites, and experiments that show the breadth of problem solving."
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project._id} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                    {project.status ? projectStatusLabels[project.status] : 'Project'}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">
                    {[project.role, project.objective].filter(Boolean).join(' • ')}
                  </p>
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
                  {formatPeriod(project.period)}
                </span>
              </div>
              <NarrativeCopy className="text-base text-gray-700" value={project.summary} />
              <HighlightsList className="mt-4" highlights={project.highlights} />
              {project.technologies?.length ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Stack</p>
                  <TagList className="mt-3" items={project.technologies} />
                </div>
              ) : null}
              {project.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.map((link, index) =>
                    link.url ? (
                      <a
                        key={link._key || `${link.url}-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 transition-colors duration-200 hover:border-gray-900"
                      >
                        {link.label || 'View link'}
                      </a>
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({skillCategories, languages}: {skillCategories: SkillCategory[]; languages: LanguageDoc[]}) {
  if (!skillCategories.length && !languages.length) {
    return null
  }

  return (
    <section id="skills" className="bg-gray-50">
      <div className="container px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          eyebrow="Capabilities"
          title="Skills & Languages"
          description="Curated categories make it easy to spot the breadth of tooling, platforms, and communication experience."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="grid gap-6 md:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">{category.label}</p>
                <TagList className="mt-4" items={category.skills} />
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Languages</p>
            <ul className="mt-4 space-y-4">
              {languages.map((language) => (
                <li key={language._id} className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="text-lg font-semibold text-gray-900">{language.name}</span>
                  <span className="text-xs uppercase tracking-[0.4em] text-gray-500">
                    {language.proficiency ? proficiencyLabels[language.proficiency] : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function CredentialsSection({
  education,
  certifications,
  publications,
}: {
  education: Education[]
  certifications: Certification[]
  publications: Publication[]
}) {
  if (!education.length && !certifications.length && !publications.length) {
    return null
  }

  return (
    <section id="credentials" className="container px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="Learning & proof"
        title="Credentials"
        description="Academic grounding, independent certifications, and published work that support the experience above."
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          {education.map((item) => (
            <div key={item._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                  {item.studyType ? studyLabels[item.studyType] : 'Education'}
                </p>
                <h3 className="text-xl font-semibold text-gray-900">{item.degree}</h3>
                <p className="text-sm text-gray-600">
                  {[item.institution, item.location].filter(Boolean).join(' • ')}
                </p>
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
                  {formatPeriod(item.period)}
                </p>
                {item.classStanding ? (
                  <p className="text-sm text-gray-600">Honours: {item.classStanding}</p>
                ) : null}
              </div>
              <NarrativeCopy className="mt-4 text-sm text-gray-700" value={item.summary} />
              {item.modules?.length ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Highlighted modules</p>
                  <TagList className="mt-3" items={item.modules} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {certifications.length ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Certifications</p>
              <ul className="mt-4 space-y-4">
                {certifications.map((cert) => (
                  <li key={cert._id} className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
                        {formatDateValue(cert.issuedAt, 'MMM d, yyyy')}
                        {cert.location ? ` • ${cert.location}` : ''}
                      </p>
                      {cert.credentialId ? (
                        <p className="text-xs text-gray-500">Credential ID: {cert.credentialId}</p>
                      ) : null}
                    </div>
                    {cert.verificationUrl ? (
                      <a
                        className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700"
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Verify credential →
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {publications.length ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Publications</p>
              <ul className="mt-4 space-y-4">
                {publications.map((publication) => (
                  <li key={publication._id} className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-gray-900">{publication.title}</p>
                      <p className="text-sm text-gray-600">
                        {[publication.publisher, publication.location].filter(Boolean).join(' • ')}
                      </p>
                      <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
                        {publication.category ? `${publicationCategoryLabels[publication.category]} • ` : ''}
                        {formatDateValue(publication.publishedAt, 'MMM d, yyyy')}
                      </p>
                      {publication.summary ? <p className="text-sm text-gray-700">{publication.summary}</p> : null}
                      {publication.citation ? (
                        <p className="text-xs text-gray-500">Citation: {publication.citation}</p>
                      ) : null}
                    </div>
                    {publication.links?.length ? (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {publication.links.map((link, index) =>
                          link.url ? (
                            <a
                              key={link._key || `${link.url}-${index}`}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 transition-colors duration-200 hover:border-gray-900"
                            >
                              {link.label || 'View'}
                            </a>
                          ) : null,
                        )}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function HighlightsList({highlights, className}: {highlights?: ImpactHighlight[]; className?: string}) {
  if (!highlights?.length) {
    return null
  }

  return (
    <ul className={['space-y-3', className].filter(Boolean).join(' ')}>
      {highlights.map((highlight) => (
        <li key={highlight._key} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          {highlight.metricValue ? (
            <div className="flex min-w-[88px] flex-col items-center justify-center rounded-xl bg-white px-3 py-2 text-center">
              <span className="text-lg font-semibold text-gray-900">{highlight.metricValue}</span>
              {highlight.metricDescription ? (
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-gray-500">
                  {highlight.metricDescription}
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="text-sm text-gray-700">{highlight.body}</p>
        </li>
      ))}
    </ul>
  )
}

function TagList({items, className}: {items?: string[]; className?: string}) {
  if (!items?.length) {
    return null
  }

  return (
    <div className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-gray-200 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gray-600"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function NarrativeCopy({value, className}: {value?: NarrativeValue; className?: string}) {
  if (!value?.length) {
    return null
  }

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <PortableText components={narrativeComponents} value={value} />
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <section className="container px-4 py-32 sm:px-6">
      <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-gray-500">No resume found</p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900">Bring your portfolio online</h1>
        <p className="mt-2 text-base text-gray-600">
          Create a Resume document in your content workspace and this page will unlock live editing instantly.
        </p>
        <a
          href={studioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors duration-200 hover:bg-blue"
        >
          Open editor
        </a>
      </div>
    </section>
  )
}

function calculateYearsOfExperience(experiences: Experience[]) {
  const orderedStarts = experiences
    .map((experience) => {
      const parsed = parseDate(experience.period?.startDate)
      return parsed?.getTime()
    })
    .filter((value): value is number => typeof value === 'number')
    .sort((a, b) => a - b)

  if (!orderedStarts.length) {
    return undefined
  }

  const earliest = new Date(orderedStarts[0])
  return Math.max(1, differenceInYears(new Date(), earliest))
}

function formatPeriod(period?: TimePeriod) {
  if (!period) {
    return '—'
  }

  const start = formatDateValue(period.startDate)
  const end = formatDateValue(period.endDate) || (period.startDate ? 'Present' : undefined)

  if (!start && !end) {
    return '—'
  }

  if (!start) {
    return end
  }

  if (!end) {
    return start
  }

  return `${start} — ${end}`
}

function formatDateValue(value?: string, pattern = 'MMM yyyy') {
  const parsed = parseDate(value)
  if (!parsed) {
    return undefined
  }

  try {
    return format(parsed, pattern)
  } catch {
    return value
  }
}

function parseDate(value?: string) {
  if (!value) {
    return undefined
  }

  try {
    return parseISO(value)
  } catch {
    return undefined
  }
}
