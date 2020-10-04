import { updateSurvey } from '@core/use-cases'
import { decodeBody, getPathParams, toApiGatewayResponse } from '@utils/api-gateway'
import { TABLE_NAME } from '@utils/constants'
import { dbClient } from '@utils/dynamodb/document-client'
import { E, get, RTE, singleton } from '@utils/fp'
import { APIGatewayEvent } from 'aws-lambda'
import { sequenceS } from 'fp-ts/lib/Apply'
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
    _.fromEither(
      sequenceS(E.either)({
        formId: pipe(getPathParams<'formId'>(event), E.map(get('formId'))),
        input: decodeBody(event),
      }),
    ),
    _.chain(updateSurvey),
    _.map(singleton('survey')),
  )

  return pipe(await res(env)(), toApiGatewayResponse())
}
