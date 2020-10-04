import { createResponse } from '@core/use-cases/responses/create-response'
import { decodeBody, toApiGatewayResponse } from '@utils/api-gateway'
import { TABLE_NAME } from '@utils/constants'
import { dbClient } from '@utils/dynamodb/document-client'
import { E, RTE, singleton } from '@utils/fp'
import { APIGatewayEvent } from 'aws-lambda'
import { pipe } from 'fp-ts/lib/function'

const _ = RTE
export const handler = async (event: APIGatewayEvent) => {
  const env = {
    db: {
      client: dbClient,
      tableName: TABLE_NAME,
    },
  }

  const res = pipe(
    _.fromEither(pipe(decodeBody(event), E.map(singleton('input')))),
    _.chain(createResponse),
    _.map(singleton('responses')),
  )

  return pipe(await res(env)(), toApiGatewayResponse())
}
