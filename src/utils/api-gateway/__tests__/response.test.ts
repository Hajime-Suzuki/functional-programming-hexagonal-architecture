import { left, right } from 'fp-ts/lib/Either'
import { apiGatewayResponse, toApiGatewayResponse } from '..'

const corsHeader = {
  'Access-Control-Allow-Origin': '*',
}

describe('api-gateway', () => {
  describe('response.fp', () => {
    describe('CASE: success response', () => {
      test('returns 200 response zby default', async () => {
        const res = await toApiGatewayResponse()(right({ test: 'yes' }))
        expect(res.statusCode).toBe(200)
        expect(res.body).toBe('{"test":"yes"}')
        expect(res.headers).toEqual(corsHeader)
      })
      test('returns custom response when custom response handler is provided', async () => {
        const handler = (v: any) =>
          apiGatewayResponse.created({ test: v.test + '!' })
        const res = await toApiGatewayResponse({
          customSuccessResponse: handler,
        })(right({ test: 'yes' }))

        expect(res.statusCode).toBe(201)
        expect(res.body).toBe('{"test":"yes!"}')
        expect(res.headers).toEqual(corsHeader)
      })
    })

    describe('CASE: error response', () => {
      test('returns error response by default', async () => {
        const res = await toApiGatewayResponse()(left(new Error('not working')))

        expect(res.statusCode).toBe(500)
        expect(res.body).toBe('{"error":"not working"}')
        expect(res.headers).toEqual(corsHeader)
      })
      test('returns custom error response when custom response handler is provided', async () => {
        const customResponse = (e: Error) =>
          apiGatewayResponse.error({ status: 403, message: e.message + '!' })

        const error = new Error('error')
        const res = await toApiGatewayResponse({
          customErrorResponse: customResponse,
        })(left(error))

        expect(res.body).toBe('{"error":"error!"}')
      })
      test('calls onError handler', async () => {
        const onError = jest.fn()

        const error = new Error('error')
        await toApiGatewayResponse({ onError })(left(error))

        expect(onError).toHaveBeenCalledWith(error)
      })
    })
  })
})
