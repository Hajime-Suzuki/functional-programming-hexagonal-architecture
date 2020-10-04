import { Response } from '@core'
import { ResponseRepository } from '@core/ports'
import { WithClient, withClient as _withClient } from '@utils/dynamodb'
import { A, get, TE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { fromResponse, mkGetByFormIdCondition, toResponse } from './response-transformation'
import { ResponseClient } from './types'

const _ = TE
const withClient: WithClient<ResponseClient> = _withClient
type Client = ResponseClient

const getByFormId = (formId: string) => (client: Client) =>
  pipe(client.query(mkGetByFormIdCondition(formId)), _.map(get('Items')), _.map(A.map(toResponse)))

const create = (data: Response) => (client: Client) =>
  pipe(
    client.create(fromResponse(data)),
    _.map(() => data),
  )

export const responseRepo: ResponseRepository = {
  create: flow(create, withClient),
  getByFormId: flow(getByFormId, withClient),
}
