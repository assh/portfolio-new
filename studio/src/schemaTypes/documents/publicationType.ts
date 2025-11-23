import {DocumentIcon, LinkIcon, TimelineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const publicationType = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'essentials', title: 'Essentials', icon: DocumentIcon, default: true},
    {name: 'timeline', title: 'Timeline', icon: TimelineIcon},
    {name: 'links', title: 'Links & citation', icon: LinkIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Provide the publication title.'),
        rule.min(5).warning('Consider using the full publication title.'),
      ],
    }),
    defineField({
      name: 'publisher',
      type: 'string',
      group: 'essentials',
      description: 'Journal, conference, or publisher name.',
      validation: (rule) => [
        rule.required().error('List the publisher to add credibility.'),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'essentials',
      description: 'City or “Online” if applicable.',
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'essentials',
      title: 'Type',
      options: {
        layout: 'radio',
        list: [
          {title: 'Conference', value: 'conference'},
          {title: 'Journal', value: 'journal'},
          {title: 'Book chapter', value: 'chapter'},
          {title: 'Article', value: 'article'},
        ],
      },
      validation: (rule) => [
        rule.required().error('Select the publication type.'),
      ],
    }),
    defineField({
      name: 'publishedAt',
      type: 'date',
      group: 'timeline',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => [
        rule.required().error('Provide the publication date.'),
      ],
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      group: 'timeline',
      description: 'Brief overview of the research focus or results.',
      validation: (rule) => [
        rule.required().error('Add a summary to explain the publication.'),
        rule.max(420).warning('Summaries are most effective below 420 characters.'),
      ],
    }),
    defineField({
      name: 'citation',
      type: 'text',
      rows: 3,
      group: 'links',
      description: 'Optional formatted citation string.',
    }),
    defineField({
      name: 'links',
      type: 'array',
      group: 'links',
      description: 'Include DOI or other canonical links.',
      of: [defineArrayMember({type: 'externalLink', icon: LinkIcon})],
      validation: (rule) => [
        rule.min(1).error('Include at least one link to the publication.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publisher',
      date: 'publishedAt',
    },
    prepare({title, subtitle, date}) {
      return {
        title,
        subtitle: [subtitle, date].filter(Boolean).join(' • '),
      }
    },
  },
})
