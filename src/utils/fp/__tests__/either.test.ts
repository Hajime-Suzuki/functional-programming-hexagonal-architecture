import { toSafeAction } from '../either'
import { isLeft } from 'fp-ts/lib/Either'

describe('utils', () => {
  describe('fp either', () => {
    describe('toSafeAction', () => {
      test('works with synchronous action', () => {
        const error = new Error('error')
        const f = (_a: number, _b: string): boolean => {
          throw error
        }
        const safe = toSafeAction(f)(1, '1')

        expect(isLeft(safe)).toBe(true)
        expect((safe as any).left).toBe(error)
      })
      test('calls custom error handler if provided', async () => {
        const f = () => {
          throw new Error('error')
        }
        const handler = (e: Error) => new Error(e.message + '!')

        const safe = toSafeAction(f, handler)()

        expect(isLeft(safe)).toBe(true)
        expect((safe as any).left.message).toBe('error!')
      })
    })
  })
})
