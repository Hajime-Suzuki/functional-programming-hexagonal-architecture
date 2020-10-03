import { getSurveyById } from '@core/survey/use-cases'
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
  const params = getPathParams<'formId'>(event)

  const res = pipe(_.fromEither(params), _.chain(getSurveyById), _.map(singleton('survey')))
  return pipe(await res(env)(), toApiGatewayResponse())
}
