import {CaseIcon, SparkleIcon, TagsIcon, TimelineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'essentials', title: 'Essentials', icon: CaseIcon, default: true},
    {name: 'timeline', title: 'Timeline', icon: TimelineIcon},
    {name: 'impact', title: 'Impact', icon: SparkleIcon},
    {name: 'skills', title: 'Stack', icon: TagsIcon},
  ],
  fields: [
    defineField({
      name: 'role',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('A role title is required to identify this experience.'),
        rule.min(3).warning('Use a descriptive role title for clarity.'),
      ],
    }),
    defineField({
      name: 'organization',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Provide the organization name to publish this experience.'),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'essentials',
      description: 'City and country or “Remote”.',
    }),
    defineField({
      name: 'employmentType',
      type: 'string',
      group: 'essentials',
      description: 'Select the engagement type for additional context.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Full-time', value: 'fullTime'},
          {title: 'Part-time', value: 'partTime'},
          {title: 'Contract', value: 'contract'},
          {title: 'Internship', value: 'internship'},
        ],
      },
      validation: (rule) => [
        rule.required().error('Select how you were engaged for this role.'),
      ],
    }),
    defineField({
      name: 'industryFocus',
      type: 'string',
      group: 'essentials',
      description: 'Optional focus area such as “Fintech” or “Healthcare AI”.',
    }),
    defineField({
      name: 'summary',
      type: 'narrativePortableText',
      group: 'essentials',
      description: 'One short paragraph describing responsibilities and scope.',
      validation: (rule) => [
        rule.required().error('Summaries help contextualize each experience.'),
      ],
    }),
    defineField({
      name: 'period',
      type: 'timePeriod',
      group: 'timeline',
      validation: (rule) => [
        rule.required().error('Provide the time period for this role.'),
      ],
    }),
    defineField({
      name: 'engagementStatus',
      type: 'string',
      group: 'timeline',
      options: {
        layout: 'radio',
        list: [
          {title: 'Current', value: 'current'},
          {title: 'Completed', value: 'completed'},
        ],
      },
      initialValue: 'completed',
      validation: (rule) => [
        rule.required().error('Select whether the engagement is ongoing.'),
      ],
    }),
    defineField({
      name: 'highlights',
      type: 'array',
      group: 'impact',
      description: 'Add measurable achievements that show the impact of this work.',
      of: [defineArrayMember({type: 'impactHighlight'})],
      validation: (rule) => [
        rule.min(1).error('Provide at least one highlight to publish this experience.'),
      ],
    }),
    defineField({
      name: 'tooling',
      type: 'array',
      group: 'skills',
      description: 'Key technologies, frameworks, and tools used.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => [rule.required().error('Tool names cannot be empty.')],
        }),
      ],
      validation: (rule) => [
        rule.unique().warning('Avoid listing the same tool multiple times.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'role',
      company: 'organization',
      startDate: 'period.startDate',
      endDate: 'period.endDate',
    },
    prepare({title, company, startDate, endDate}) {
      return {
        title,
        subtitle: [company, [startDate, endDate || 'Present'].filter(Boolean).join(' → ')].filter(Boolean).join(
          ' • ',
        ),
      }
    },
  },
})
