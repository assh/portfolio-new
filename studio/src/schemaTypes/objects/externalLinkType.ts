import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const externalLinkType = defineType({
  name: 'externalLink',
  title: 'External link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'Short label such as “Case study” or “Source”.',
      validation: (rule) => [
        rule.required().error('Provide a label so the link has context.'),
        rule.max(60).warning('Keep labels short for better readability.'),
      ],
    }),
    defineField({
      name: 'url',
      type: 'url',
      description: 'Use full HTTPS URLs to ensure links are valid.',
      validation: (rule) => [
        rule.required().error('A URL is required for the link to be usable.'),
        rule.uri({scheme: ['https', 'http']}).error('Enter a valid HTTP or HTTPS URL.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'url',
    },
  },
})
