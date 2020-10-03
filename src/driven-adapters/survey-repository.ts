import { Survey } from '@core/survey'
import { Env } from '@core/survey/use-cases/get-survey-by-id'
import { NotFoundError, toNotFoundError } from '@utils/errors/not-found-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { E, get, ReaderTaskEither, RTE, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { getClient, toPK, toSK } from './survey-repository-client'

const _ = RTE

const getByFormId = (
  formId: string,
): ReaderTaskEither<Env, RepositoryError | NotFoundError, Survey> =>
  pipe(
    getClient,
    _.chain(client => {
      const process = client.get(toPK(formId), toSK())

      const output = pipe(
        process,
        TE.map(get('Item')),
        TE.chain(
          flow(E.fromNullable(toNotFoundError(`survey ${formId} not found`)), TE.fromEither),
        ),
        TE.map(toSurvey),
      )

      return _.fromTaskEither(output)
    }),
  )

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

const toSurvey = (data: SurveyResponse): Survey => ({
  id: data.PK.replace('survey_', ''),
  closeDate: data.closeDate,
  questions: data.questions as Survey['questions'],
})

export const surveyRepo = {
  getByFormId,
}
