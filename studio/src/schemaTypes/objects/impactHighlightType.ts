import {BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const impactHighlightType = defineType({
  name: 'impactHighlight',
  title: 'Impact highlight',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      description: 'Summarize the measurable impact in one concise sentence.',
      validation: (rule) => [
        rule.required().error('Describe the outcome so the highlight can be published.'),
        rule.max(260).warning('Highlights are most effective when kept under 260 characters.'),
      ],
    }),
    defineField({
      name: 'metricValue',
      type: 'string',
      description: 'Optional numeric change such as “35%” or “£120K”.',
    }),
    defineField({
      name: 'metricDescription',
      type: 'string',
      description: 'Short label describing what the metric value measures.',
      validation: (rule) => [rule.max(60).warning('Keep the metric description succinct.')],
    }),
  ],
  preview: {
    select: {
      title: 'body',
      subtitle: 'metricValue',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `Impact: ${subtitle}` : 'Impact detail',
      }
    },
  },
})
