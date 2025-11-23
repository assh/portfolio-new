import {StarIcon, TimelineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const certificationType = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: StarIcon,
  groups: [
    {name: 'essentials', title: 'Essentials', icon: StarIcon, default: true},
    {name: 'verification', title: 'Verification', icon: TimelineIcon},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('Certification name is required.'),
      ],
    }),
    defineField({
      name: 'issuer',
      type: 'string',
      group: 'essentials',
      validation: (rule) => [
        rule.required().error('List the issuing organization.'),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'essentials',
      description: 'City or “Online”.',
    }),
    defineField({
      name: 'issuedAt',
      type: 'date',
      group: 'verification',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => [
        rule.required().error('Provide the date the certification was issued.'),
      ],
    }),
    defineField({
      name: 'credentialId',
      type: 'string',
      group: 'verification',
      description: 'Optional credential code or ID.',
      validation: (rule) => [
        rule.max(120).warning('Credential IDs rarely need to exceed 120 characters.'),
      ],
    }),
    defineField({
      name: 'verificationUrl',
      type: 'url',
      group: 'verification',
      description: 'Link to the verification or certificate page.',
      validation: (rule) => [
        rule.required().error('Add a verification URL for credibility.'),
        rule.uri({scheme: ['https', 'http']}).error('Use a valid HTTP or HTTPS URL.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'issuer',
      date: 'issuedAt',
    },
    prepare({title, subtitle, date}) {
      return {
        title,
        subtitle: [subtitle, date].filter(Boolean).join(' • '),
      }
    },
  },
})
