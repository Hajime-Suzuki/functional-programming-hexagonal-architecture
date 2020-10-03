import { fold } from 'fp-ts/lib/Either'

type APIGatewayResponse<T = unknown> = {
  statusCode: number
  body: T
  headers?: Record<string, string>
}

type Options = {
  onError?: (error: Error) => Promise<void>
  customErrorResponse?: (error: Error) => APIGatewayResponse
  customSuccessResponse?: (res: unknown) => APIGatewayResponse
}
export const toApiGatewayResponse = <E extends Error, A>(options?: Options) =>
  fold<E, A, Promise<APIGatewayResponse<any>>>(
    handlerError(options?.onError)(options?.customErrorResponse),
    handleSuccess(options?.customSuccessResponse)
  )

const handlerError = (onError?: Options['onError']) => (
  customResponse?: (error: Error) => APIGatewayResponse
) => async (e: Error) => {
  if (onError) await onError(e)
  if (customResponse) return customResponse(e)
  return error(e)
}

const handleSuccess = (
  customResponse?: (res: unknown) => APIGatewayResponse
) => async (res: unknown) => {
  if (customResponse) return customResponse(res)
  return success(res)
}

type CurrentlySupportedStatusCode = 200 | 201 | CurrentlySupportedErrorCode
type CurrentlySupportedErrorCode = 400 | 403 | 404 | 500

const formatBody = (statusCode: CurrentlySupportedStatusCode) => (
  body: unknown
): APIGatewayResponse => ({
  statusCode,
  body: JSON.stringify(body, null),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})

const success = formatBody(200)
const created = formatBody(201)
const error = (e: { status?: CurrentlySupportedErrorCode; message: string }) =>
  formatBody(e.status || 500)({ error: e.message })

export const apiGatewayResponse = {
  success,
  created,
  error,
}
