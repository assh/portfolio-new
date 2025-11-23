import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

export const resumeBasicsQuery = defineQuery(`
  *[_type == "resume"][0]{
    fullName,
    headline,
    location,
  }
`)

export const resumeQuery = defineQuery(`
  *[_type == "resume"][0]{
    _id,
    fullName,
    headline,
    location,
    summary,
    experiences[]->{
      _id,
      role,
      organization,
      location,
      employmentType,
      industryFocus,
      summary,
      period,
      engagementStatus,
      tooling,
      highlights[]{
        _key,
        body,
        metricValue,
        metricDescription,
      },
    },
    projects[]->{
      _id,
      title,
      role,
      objective,
      summary,
      period,
      status,
      technologies,
      links[]{
        _key,
        label,
        url,
      },
      highlights[]{
        _key,
        body,
        metricValue,
        metricDescription,
      },
    },
    education[]->{
      _id,
      degree,
      institution,
      location,
      studyType,
      period,
      classStanding,
      modules,
      summary,
    },
    publications[]->{
      _id,
      title,
      publisher,
      location,
      category,
      publishedAt,
      summary,
      citation,
      links[]{
        _key,
        label,
        url,
      },
    },
    certifications[]->{
      _id,
      name,
      issuer,
      location,
      issuedAt,
      credentialId,
      verificationUrl,
    },
    skillCategories[]->{
      _id,
      label,
      skills,
    },
    languages[]->{
      _id,
      name,
      proficiency,
    },
  }
`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
