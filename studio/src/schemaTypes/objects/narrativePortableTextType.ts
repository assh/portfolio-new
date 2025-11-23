import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const narrativePortableTextType = defineType({
  name: 'narrativePortableText',
  title: 'Narrative copy',
  type: 'array',
  icon: ComposeIcon,
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
      lists: [],
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                validation: (rule) => [
                  rule.required().error('Links need a valid URL.'),
                  rule.uri({scheme: ['http', 'https']}).error('Links must be HTTP or HTTPS URLs.'),
                ],
              }),
            ],
          },
        ],
      },
    }),
  ],
})
