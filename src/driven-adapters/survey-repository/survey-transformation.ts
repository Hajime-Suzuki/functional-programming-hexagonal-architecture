import { Survey } from '@core/survey'
import { DBKey, DBSurvey, PK, SK } from './types'

export const toSurvey = (data: DBSurvey): Survey => ({
  id: fromPK(data.PK),
  closeDate: data.closeDate,
  questions: data.questions as Survey['questions'],
})

export const fromSurvey = (data: Survey): DBSurvey => ({
  PK: toPK(data.id),
  SK: toSK(),
  closeDate: data.closeDate,
  questions: data.questions,
})

export const toPK = (id: Survey['id']): PK => 'survey_' + id
export const fromPK = (id: PK) => id.replace('survey_', '')
const toSK = (): SK => '#survey'

export const mkDBKey = (id: Survey['id']): DBKey => ({ PK: toPK(id), SK: toSK() })
