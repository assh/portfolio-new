import {certificationType} from './documents/certificationType'
import {educationType} from './documents/educationType'
import {experienceType} from './documents/experienceType'
import {languageType} from './documents/languageType'
import {projectType} from './documents/projectType'
import {publicationType} from './documents/publicationType'
import {resumeType} from './documents/resumeType'
import {skillCategoryType} from './documents/skillCategoryType'
import {externalLinkType} from './objects/externalLinkType'
import {impactHighlightType} from './objects/impactHighlightType'
import {narrativePortableTextType} from './objects/narrativePortableTextType'
import {timePeriodType} from './objects/timePeriodType'

export const schemaTypes = [
  // Documents
  resumeType,
  experienceType,
  educationType,
  projectType,
  publicationType,
  certificationType,
  skillCategoryType,
  languageType,

  // Objects
  timePeriodType,
  impactHighlightType,
  externalLinkType,
  narrativePortableTextType,
]
