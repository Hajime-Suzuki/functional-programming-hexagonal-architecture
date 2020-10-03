import { Survey } from '@core/survey'
import { DBSurvey, PK, SK } from './types'

export const toSurvey = (data: DBSurvey): Survey => ({
  id: data.PK.replace('survey_', ''),
  closeDate: data.closeDate,
  questions: data.questions as Survey['questions'],
})

export const fromSurvey = (data: Survey): DBSurvey => ({
  PK: toPK(data.id).value,
  SK: toSK().value,
  closeDate: data.closeDate,
  questions: data.questions,
})

export const toPK = (id: Survey['id']): PK => ({ __name__: 'survey-pk', value: 'survey_' + id })
export const toSK = (): SK => ({ __name__: 'survey-sk', value: 'survey' })
