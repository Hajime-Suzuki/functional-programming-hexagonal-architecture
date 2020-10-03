import { isRight, toError, isLeft } from 'fp-ts/lib/Either'
import { run } from 'fp-ts/lib/ReaderTaskEither'
import { withEnvFactory } from '../reader-task-either'

describe('utils', () => {
  describe('fp readerTaskEither', () => {
    describe('withEnvFactory', () => {
      test('calls function with env', async () => {
        const f = jest.fn().mockImplementation(async () => 42) // * mock resolvedValue does not work

        const env = { test: 'yes' }
        const action = withEnvFactory(toError)(f)
        await run(action, env)

        expect(f).toHaveBeenCalledWith(env)
      })

      test('returns right when functions succeeds', async () => {
        const f = jest.fn().mockImplementation(async () => 42) // * mock resolvedValue does not work

        const env = { test: 'yes' }
        const action = withEnvFactory(toError)(f)
        const res = await run(action, env)

        expect(isRight(res)).toBe(true)
        expect((res as any).right).toBe(42)
      })

      test('returns left when functions fails', async () => {
        const error = new Error('error')
        const f = jest.fn().mockImplementation(async () => {
          throw error
        }) // * mock resolvedValue does not work

        const env = { test: 'yes' }
        const action = withEnvFactory(toError)(f)
        const res = await run(action, env)

        expect(isLeft(res)).toBe(true)
        expect((res as any).left).toEqual(error)
      })
    })
  })
})
