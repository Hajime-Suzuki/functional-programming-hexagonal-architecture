import { AppError, toAppError } from '@utils/errors/app-error'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { TaskEither, ReaderTaskEither, RTE } from '.'
import { flip } from './functions'
import { liftPromise } from './task-either'

export const withEnvFactory = <E extends AppError>(toError: (e: unknown) => E) => <
  R,
  E extends AppError,
  A
>(
  f: (env: R) => TaskEither<E, A> | Promise<A>,
): ReaderTaskEither<R, AppError | E, A> => {
  return pipe(
    RTE.ask<R>(),
    RTE.chain(env => {
      const res = f(env)

      if (_isPromise(res)) {
        return RTE.fromTaskEither(liftPromise(res, toError))
      }

      return RTE.fromTaskEither(res)
    }),
  )
}

export const withEnv = withEnvFactory(toAppError)

export const withEnvL = flow(withEnv, constant)

type WithEnvF = <R, E extends AppError, A, B>(
  f: (r: R) => (a: A) => TaskEither<E, B>,
) => (a: A) => ReaderTaskEither<R, E | AppError, B>

export const withEnvF: WithEnvF = f => flow(flip(f), withEnv)

export const constInput = <R, E, A>(ma: ReaderTaskEither<R, E, A>) => <B>(data: B) => {
  return pipe(ma, RTE.map(constant(data)))
}

const _isPromise = <A>(obj: any): obj is Promise<A> => obj instanceof Promise
