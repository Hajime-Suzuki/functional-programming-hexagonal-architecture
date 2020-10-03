import { APIGatewayEvent } from 'aws-lambda'
import { isLeft, isRight } from 'fp-ts/lib/Either'
import { decodeBody } from '../parsers'

describe('api-gateway', () => {
  describe('parsers.fp', () => {
    describe('decodeBody', () => {
      test('returns left if body is empty', () => {
        const event = { body: null } as APIGatewayEvent
        const decoded = decodeBody(event)
        expect(isLeft(decoded)).toBe(true)
      })

      test('correctly decodes body if it is non-empty string', () => {
        const event = {
          body: JSON.stringify({ test: 'yes' }),
        } as APIGatewayEvent

        const decoded = decodeBody(event)

        expect(isRight(decoded)).toBe(true)
        expect((decoded as any).right).toEqual({ test: 'yes' })
      })
    })
  })
})
