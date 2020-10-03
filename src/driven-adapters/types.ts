import { ReaderTaskEither, TaskEither } from '@utils/fp'

export type WithClient<TClient> = <R, E, A>(
  fn: (client: TClient) => TaskEither<E, A>,
) => ReaderTaskEither<R, E, A>
