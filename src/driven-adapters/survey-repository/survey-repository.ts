import { Survey, UpdateSurveyInput } from '@core/survey'
import { SurveyRepository } from '@core/ports'
import { mkDBUpdateInput, WithClient, withClient as _withClient } from '@utils/dynamodb'
import { toNotFoundError } from '@utils/errors/not-found-error'
import { E, get, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { fromSurvey, mkDBKey, toSurvey } from './survey-transformation'
import { SurveyClient } from './types'

const _ = TE
const withClient: WithClient<SurveyClient> = _withClient

const getByFormId = (formId: string) => (client: SurveyClient) =>
  pipe(
    client.get({ Key: mkDBKey(formId) }),
    _.map(get('Item')),
    _.chainW(flow(E.fromNullable(toNotFoundError(`survey ${formId} not found`)), _.fromEither)),
    _.map(toSurvey),
  )

const create = (data: Survey) => (client: SurveyClient) =>
  pipe(
    client.create(fromSurvey(data)),
    _.map(() => data),
  )

const update = (formId: string) => (data: UpdateSurveyInput) => (client: SurveyClient) =>
  pipe(
    client.update(
      mkDBKey(formId),
      mkDBUpdateInput({
        ...(data.closeDate && { closeDate: data.closeDate }),
        ...(data.questions && { questions: data.questions }),
      }),
    ),
    TE.map(get('Attributes')),
    TE.map(toSurvey),
  )

export const surveyRepo: SurveyRepository = {
  getByFormId: flow(getByFormId, withClient),
  create: flow(create, withClient),
  update: formId => flow(update(formId), withClient),
}
