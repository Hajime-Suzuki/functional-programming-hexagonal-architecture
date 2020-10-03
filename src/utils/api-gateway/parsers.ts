import { Maybe } from '@utils/types'
import { APIGatewayEvent } from 'aws-lambda'
import { Either, fromNullable, map, toError } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

export const getPathParams = <T extends string>(
  event: APIGatewayEvent,
): Either<Error, Record<T, string>> =>
  fromNullable(toError('path params not found'))(event.pathParameters as any)

export const getQueryParams = <T extends string>(
  event: APIGatewayEvent,
): Either<Error, Record<T, Maybe<string>>> =>
  fromNullable(toError('query params not found'))(event.queryStringParameters as any)

export const decodeBody = <T extends Record<string, any>>(
  event: APIGatewayEvent,
): Either<Error, T> => pipe(fromNullable(toError('body not found'))(event.body), map(JSON.parse))
