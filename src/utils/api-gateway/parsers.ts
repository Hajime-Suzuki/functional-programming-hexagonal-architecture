import { AppError, toAppError } from '@utils/errors/app-error'
import { Maybe } from '@utils/types'
import { APIGatewayEvent } from 'aws-lambda'
import { Either, fromNullable, map } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

export const getPathParams = <T extends string>(
  event: APIGatewayEvent,
): Either<AppError, Record<T, string>> =>
  fromNullable(toAppError('path params not found'))(event.pathParameters as any)

export const getQueryParams = <T extends string>(
  event: APIGatewayEvent,
): Either<AppError, Record<T, Maybe<string>>> =>
  fromNullable(toAppError('query params not found'))(event.queryStringParameters as any)

export const decodeBody = <T extends Record<string, any>>(
  event: APIGatewayEvent,
): Either<AppError, T> =>
  pipe(fromNullable(toAppError('body not found'))(event.body), map(JSON.parse))
