import {
  DocumentTextIcon,
  SparkleIcon,
  UsersIcon,
} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const resumeType = defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'identity', title: 'Identity', icon: UsersIcon, default: true},
    {name: 'content', title: 'Content', icon: DocumentTextIcon},
    {name: 'meta', title: 'Meta', icon: SparkleIcon},
  ],
  fields: [
    defineField({
      name: 'fullName',
      type: 'string',
      group: 'identity',
      validation: (rule) => [
        rule.required().error('Full name is required for the resume.'),
      ],
    }),
    defineField({
      name: 'headline',
      type: 'string',
      group: 'identity',
      description: 'Short professional headline, e.g. “Software Developer”.',
      validation: (rule) => [
        rule.required().error('Add a headline to explain the focus of the resume.'),
        rule.max(90).warning('Headlines are scannable when kept under 90 characters.'),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'identity',
      description: 'Primary city or “Remote, UK”.',
    }),
    defineField({
      name: 'summary',
      type: 'narrativePortableText',
      group: 'identity',
      description: 'Intro narrative that ties the experience together.',
      validation: (rule) => [
        rule.required().error('Provide a summary to describe the career narrative.'),
      ],
    }),
    defineField({
      name: 'experiences',
      type: 'array',
      group: 'content',
      description: 'Reference professional experiences to include in this resume.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'experience'}],
        }),
      ],
      validation: (rule) => [
        rule.min(1).error('Add at least one experience to publish this resume.'),
      ],
    }),
    defineField({
      name: 'projects',
      type: 'array',
      group: 'content',
      description: 'Reference notable projects relevant to this resume version.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
        }),
      ],
    }),
    defineField({
      name: 'education',
      type: 'array',
      group: 'content',
      description: 'Reference education entries.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'education'}],
        }),
      ],
    }),
    defineField({
      name: 'publications',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'publication'}],
        }),
      ],
    }),
    defineField({
      name: 'certifications',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'certification'}],
        }),
      ],
    }),
    defineField({
      name: 'skillCategories',
      type: 'array',
      group: 'meta',
      description: 'Reference curated skill groups.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'skillCategory'}],
        }),
      ],
      validation: (rule) => [
        rule.min(1).warning('Linking relevant skills helps highlight strengths.'),
      ],
    }),
    defineField({
      name: 'languages',
      type: 'array',
      group: 'meta',
      description: 'Reference languages to highlight.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'language'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'headline',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      }
    },
  },
})
