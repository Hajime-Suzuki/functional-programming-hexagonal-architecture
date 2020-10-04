import { createSurvey } from '@core/use-cases'
import { apiGatewayResponse, decodeBody, toApiGatewayResponse } from '@utils/api-gateway'
import { TABLE_NAME } from '@utils/constants'
import { dbClient } from '@utils/dynamodb/document-client'
import { RTE, singleton } from '@utils/fp'
import { APIGatewayEvent } from 'aws-lambda'
import { flow } from 'fp-ts/lib/function'
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
    _.fromEither(decodeBody(event)),
    _.chain(flow(singleton('input'), createSurvey)),
    _.map(singleton('survey')),
  )

  return pipe(
    await res(env)(),
    toApiGatewayResponse({ customSuccessResponse: apiGatewayResponse.created }),
  )
}
