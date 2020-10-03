import { SurveyRepository } from '@core/survey/ports'
import { toNotFoundError } from '@utils/errors/not-found-error'
import { E, get, RTE, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { toPK, toSK, withClient } from './survey-repository-client'
import { toSurvey } from './survey-transformation'
import { SurveyClient } from './types'

const _ = RTE

const getByFormId = (formId: string) => (client: SurveyClient) =>
  pipe(
    client.get(toPK(formId), toSK()),
    TE.map(get('Item')),
    TE.chainW(flow(E.fromNullable(toNotFoundError(`survey ${formId} not found`)), TE.fromEither)),
    TE.map(toSurvey),
  )

export const surveyRepo: SurveyRepository = {
  getByFormId: flow(getByFormId, withClient),
}
