import { liftAsyncAction, liftPromise } from '../task-either'
import { isLeft, isRight } from 'fp-ts/lib/Either'

describe('utils', () => {
  describe('fp taskEither', () => {
    describe('liftAsync', () => {
      test('works with async action', async () => {
        const error = new Error('error')
        const f = async (_a: number, _b: string): Promise<boolean> => {
          throw error
        }
        const safe = await liftAsyncAction(f)(1, '1')()

        expect(isLeft(safe)).toBe(true)
        expect((safe as any).left).toBe(error)
      })
      test('calls custom error handler if provided', async () => {
        const f = async (): Promise<string> => {
          throw new Error('error')
        }
        const handler = (e: Error) => new Error(e.message + '!')

        const safe = await liftAsyncAction(f, handler)()()

        expect(isLeft(safe)).toBe(true)
        expect((safe as any).left.message).toBe('error!')
      })
    })

    describe('liftPromise', () => {
      test('returns taskEither right if promise resolves', async () => {
        const res = await liftPromise(Promise.resolve(42))()

        expect(isRight(res)).toBe(true)
        expect((res as any).right).toBe(42)
      })
      test('returns taskEither left if promise rejects', async () => {
        const res = await liftPromise(Promise.reject(-42))()

        expect(isLeft(res)).toBe(true)
        expect((res as any).left).toEqual(new Error('-42'))
      })
      test('calls custom handler formats if provided', async () => {
        const res = await liftPromise(Promise.reject(-42), (e: number) => e * 10)()

        expect(isLeft(res)).toBe(true)
        expect((res as any).left).toEqual(-420)
      })
    })
  })
})
