import { getSurveyById } from '@core/survey/use-cases'
import { getPathParams, toApiGatewayResponse } from '@utils/api-gateway'
import { RTE } from '@utils/fp'
import { APIGatewayEvent } from 'aws-lambda'
import { pipe } from 'fp-ts/lib/function'

export const handler = async (event: APIGatewayEvent) => {
  const env = { db: 'some db connection' }
  const params = getPathParams<'formId'>(event)

  const res = pipe(RTE.fromEither(params), RTE.chain(getSurveyById))
  return pipe(await RTE.run(res, env), toApiGatewayResponse())
}
