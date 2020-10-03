import { createSurvey } from '@core/survey/use-cases'

export const handler = async () => {
  const res = createSurvey()
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
