import { toAppError } from '@utils/errors/app-error'
import * as TE from 'fp-ts/lib/TaskEither'

export const liftPromise = <E, A>(p: Promise<A>, customToError?: (e: unknown) => E) =>
  liftAsyncAction(() => p, customToError)()

export const liftAsyncAction = <E, A, TArgs extends any[]>(
  f: (...args: TArgs) => Promise<A>,
  customToError?: (e: unknown) => E,
) => {
  return TE.tryCatchK(f, e => {
    if (customToError) return customToError(e)
    return toAppError(e)
  })
}
