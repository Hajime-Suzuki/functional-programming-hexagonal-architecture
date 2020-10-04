import { getByFormId } from '@core/use-cases/responses/get-by-form-id'
import { getPathParams, toApiGatewayResponse } from '@utils/api-gateway'
import { TABLE_NAME } from '@utils/constants'
import { dbClient } from '@utils/dynamodb/document-client'
import { RTE, singleton } from '@utils/fp'
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
    _.fromEither(getPathParams(event)),
    _.chain(getByFormId),
    _.map(singleton('responses')),
  )

  return pipe(await res(env)(), toApiGatewayResponse())
}
