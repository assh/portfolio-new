import {
  LinkIcon,
  ProjectsIcon,
  SparkleIcon,
  TagsIcon,
  TimelineIcon,
} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    {name: 'essentials', title: 'Essentials', icon: ProjectsIcon, default: true},
    {name: 'timeline', title: 'Timeline', icon: TimelineIcon},
    {name: 'impact', title: 'Impact', icon: SparkleIcon},
    {name: 'stack', title: 'Stack & Links', icon: TagsIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Projects need a title before publishing.'),
        rule.min(3).warning('Use a descriptive name for the project.'),
      ],
    }),
    defineField({
      name: 'role',
      type: 'string',
      group: 'essentials',
      description: 'Optional role or responsibility, e.g. “Lead Engineer”.',
    }),
    defineField({
      name: 'objective',
      type: 'string',
      group: 'essentials',
      description: 'Single sentence describing the business problem or goal.',
      validation: (rule) => [
        rule.required().error('Describe the objective to frame the project.'),
        rule.max(160).warning('Keep the objective concise.'),
      ],
    }),
    defineField({
      name: 'summary',
      type: 'narrativePortableText',
      group: 'essentials',
      description: '2–3 short paragraphs outlining approach, scope, and results.',
      validation: (rule) => [
        rule.required().error('Add a summary to explain how the project was delivered.'),
      ],
    }),
    defineField({
      name: 'period',
      type: 'timePeriod',
      group: 'timeline',
      validation: (rule) => [
        rule.required().error('Provide start and end dates for the project timeline.'),
      ],
    }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'timeline',
      options: {
        layout: 'radio',
        list: [
          {title: 'Planned', value: 'planned'},
          {title: 'In progress', value: 'inProgress'},
          {title: 'Completed', value: 'completed'},
        ],
      },
      initialValue: 'completed',
      validation: (rule) => [
        rule.required().error('Select the current project status.'),
      ],
    }),
    defineField({
      name: 'highlights',
      type: 'array',
      group: 'impact',
      description: 'Impact statements that quantify results.',
      of: [defineArrayMember({type: 'impactHighlight'})],
      validation: (rule) => [
        rule.min(1).error('Add at least one highlight that shows measurable impact.'),
      ],
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      group: 'stack',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => [rule.required().error('Technology names cannot be empty.')],
        }),
      ],
      validation: (rule) => [
        rule.unique().warning('Avoid listing the same technology multiple times.'),
      ],
    }),
    defineField({
      name: 'links',
      type: 'array',
      group: 'stack',
      description: 'Add any supporting case studies, GitHub repos, or articles.',
      of: [defineArrayMember({type: 'externalLink', icon: LinkIcon})],
      validation: (rule) => [
        rule.min(1).warning('Adding a link helps reviewers explore the work.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      startDate: 'period.startDate',
      endDate: 'period.endDate',
    },
    prepare({title, status, startDate, endDate}) {
      const duration = [startDate, endDate || 'Present'].filter(Boolean).join(' → ')
      return {
        title,
        subtitle: [status?.replace(/([A-Z])/g, ' $1')?.toLowerCase(), duration]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
