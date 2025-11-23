import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const timePeriodType = defineType({
  name: 'timePeriod',
  title: 'Time period',
  type: 'object',
  icon: CalendarIcon,
  fieldsets: [
    {
      name: 'duration',
      title: 'Duration',
      options: {columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'startDate',
      type: 'date',
      description: 'Use the exact date the work or study began.',
      fieldset: 'duration',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => [
        rule.required().error('A start date is required to show the beginning of the period.'),
      ],
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      description: 'Leave empty when the engagement is ongoing.',
      fieldset: 'duration',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => [
        rule.custom((endDate, context) => {
          const startDate = (context.parent as {startDate?: string} | undefined)?.startDate
          if (!endDate || !startDate) {
            return true
          }

          return endDate >= startDate ? true : 'End date must be on or after the start date.'
        }),
      ],
    }),
  ],
  preview: {
    select: {
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare({startDate, endDate}) {
      return {
        title: [startDate, endDate].filter(Boolean).join(' → ') || 'Time period',
        subtitle: 'Start and end dates',
      }
    },
  },
})
