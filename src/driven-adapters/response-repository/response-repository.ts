import { Response } from '@core'
import { ResponseRepository } from '@core/ports'
import { WithClient, withClient as _withClient } from '@utils/dynamodb'
import { RepositoryError } from '@utils/errors/repository-error'
import { A, get, O, Option, TaskEither, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import {
  fromResponse,
  mkDBKey,
  mkGetByFormIdCondition,
  toResponse,
} from './response-transformation'
import { ResponseClient } from './types'

const _ = TE
const withClient: WithClient<ResponseClient> = _withClient
type Client = ResponseClient
type Repo = ResponseRepository

const getOne = (data: { formId: string; email: string }) => (
  client: Client,
): TaskEither<RepositoryError, Option<Response>> =>
  pipe(
    client.get({ Key: mkDBKey(data) }),
    _.map(get('Item')),
    _.map(O.fromNullable),
    _.map(O.map(toResponse)),
  )

const getByFormId = (formId: string) => (client: Client) =>
  pipe(client.query(mkGetByFormIdCondition(formId)), _.map(get('Items')), _.map(A.map(toResponse)))

const create = (data: Response) => (client: Client) =>
  pipe(
    client.create(fromResponse(data)),
    _.map(() => data),
  )

export const responseRepo: Repo = {
  create: flow(create, withClient),
  getByFormId: flow(getByFormId, withClient),
  getOne: flow(getOne, withClient),
}
