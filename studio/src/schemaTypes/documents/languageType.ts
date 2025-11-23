import {TranslateIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const languageType = defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  icon: TranslateIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => [
        rule.required().error('Provide the language name.'),
      ],
    }),
    defineField({
      name: 'proficiency',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Native', value: 'native'},
          {title: 'Fluent', value: 'fluent'},
          {title: 'Professional', value: 'professional'},
          {title: 'Conversational', value: 'conversational'},
        ],
      },
      validation: (rule) => [
        rule.required().error('Select a proficiency level.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'proficiency',
    },
  },
})
