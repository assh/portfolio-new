import {BookIcon, SparkleIcon, TimelineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'essentials', title: 'Essentials', icon: BookIcon, default: true},
    {name: 'timeline', title: 'Timeline', icon: TimelineIcon},
    {name: 'details', title: 'Details', icon: SparkleIcon},
  ],
  fields: [
    defineField({
      name: 'degree',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Name the degree or programme to save this entry.'),
        rule.min(3).warning('Consider using the full name of the programme.'),
      ],
    }),
    defineField({
      name: 'institution',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Provide the institution so the degree has context.'),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'essentials',
      description: 'Campus city and country or “Remote”.',
    }),
    defineField({
      name: 'studyType',
      type: 'string',
      group: 'essentials',
      options: {
        layout: 'radio',
        list: [
          {title: 'Full-time', value: 'fullTime'},
          {title: 'Part-time', value: 'partTime'},
          {title: 'Distance / Online', value: 'distance'},
        ],
      },
      validation: (rule) => [
        rule.required().error('Select the study type for this programme.'),
      ],
    }),
    defineField({
      name: 'period',
      type: 'timePeriod',
      group: 'timeline',
      validation: (rule) => [rule.required().error('Provide the attendance dates.')],
    }),
    defineField({
      name: 'classStanding',
      type: 'string',
      group: 'details',
      description: 'Final classification or honours.',
    }),
    defineField({
      name: 'modules',
      type: 'array',
      group: 'details',
      description: 'Notable modules relevant to the target role.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => [rule.required().error('Module titles cannot be empty.')],
        }),
      ],
      validation: (rule) => [rule.unique().warning('Avoid duplicate module names.')],
    }),
    defineField({
      name: 'summary',
      type: 'narrativePortableText',
      group: 'details',
      description: 'Short overview emphasising focus areas, research, or outcomes.',
      validation: (rule) => [
        rule.required().error('Add a summary to explain why this education matters.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'degree',
      subtitle: 'institution',
      startDate: 'period.startDate',
      endDate: 'period.endDate',
    },
    prepare({title, subtitle, startDate, endDate}) {
      const duration = [startDate, endDate || 'Present'].filter(Boolean).join(' → ')
      return {
        title,
        subtitle: [subtitle, duration].filter(Boolean).join(' • '),
      }
    },
  },
})
