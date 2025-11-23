import {TagsIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const skillCategoryType = defineType({
  name: 'skillCategory',
  title: 'Skill category',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => [
        rule.required().error('Name the skill category.'),
      ],
    }),
    defineField({
      name: 'skills',
      type: 'array',
      description: 'List specific skills or technologies.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => [rule.required().error('Skill entries cannot be empty.')],
        }),
      ],
      validation: (rule) => [
        rule.required().error('Add at least one skill to the category.'),
        rule.unique().warning('Avoid duplicates in the same category.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      skills: 'skills',
    },
    prepare({title, skills}) {
      return {
        title,
        subtitle: skills?.slice(0, 3).join(', '),
      }
    },
  },
})
