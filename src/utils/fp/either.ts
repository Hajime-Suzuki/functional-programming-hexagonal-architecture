import { tryCatch, toError } from 'fp-ts/lib/Either'

export const toSafeAction = <E, A, TArgs extends any[]>(
  fn: (...args: TArgs) => A,
  customToError?: (e: unknown) => E,
) => (...args: TArgs) => {
  return tryCatch(
    () => fn(...args),
    e => {
      if (customToError) return customToError(e)
      return toError(e)
    },
  )
}
