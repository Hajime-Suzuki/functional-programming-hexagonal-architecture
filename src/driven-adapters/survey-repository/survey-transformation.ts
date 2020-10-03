import { Survey } from '@core/survey'

type SurveyResponse = {
  SK: string
  PK: string
  closeDate: string
  questions: {
    type: string
    options: string[]
    id: string
  }[]
}

export const toSurvey = (data: SurveyResponse): Survey => ({
  id: data.PK.replace('survey_', ''),
  closeDate: data.closeDate,
  questions: data.questions as Survey['questions'],
})
