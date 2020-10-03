import { getSurveyById } from '@core/survey/use-cases'
import { getPathParams, toApiGatewayResponse } from '@utils/api-gateway'
import { TABLE_NAME } from '@utils/constants'
import { dbClient } from '@utils/dynamodb/document-client'
import { RTE } from '@utils/fp'
import { APIGatewayEvent } from 'aws-lambda'
import { pipe } from 'fp-ts/lib/function'

export const handler = async (event: APIGatewayEvent) => {
  const env = {
    db: {
      client: dbClient,
      tableName: TABLE_NAME,
    },
  }
  const params = getPathParams<'formId'>(event)

  const res = pipe(RTE.fromEither(params), RTE.chain(getSurveyById))
  return pipe(await res(env)(), toApiGatewayResponse())
}
