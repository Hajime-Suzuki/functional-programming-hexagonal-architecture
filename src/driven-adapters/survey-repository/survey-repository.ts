import { Survey } from '@core/survey'
import { SurveyRepository } from '@core/survey/ports'
import { toNotFoundError } from '@utils/errors/not-found-error'
import { E, get, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { withClient } from './db-client'
import { fromSurvey, toPK, toSK, toSurvey } from './survey-transformation'
import { SurveyClient } from './types'

const _ = TE

const getByFormId = (formId: string) => (client: SurveyClient) =>
  pipe(
    client.get(toPK(formId), toSK()),
    _.map(get('Item')),
    _.chainW(flow(E.fromNullable(toNotFoundError(`survey ${formId} not found`)), _.fromEither)),
    _.map(toSurvey),
  )

const create = (data: Survey) => (client: SurveyClient) =>
  pipe(
    client.create(fromSurvey(data)),
    _.map(() => data),
  )

export const surveyRepo: SurveyRepository = {
  getByFormId: flow(getByFormId, withClient),
  create: flow(create, withClient),
}
