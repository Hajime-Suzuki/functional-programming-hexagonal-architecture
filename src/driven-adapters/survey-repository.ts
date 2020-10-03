import { Survey } from '@core/survey'
import { RepositoryError } from '@utils/errors/repository-error'
import { liftPromise, ReaderTaskEither, RTE, TE, withEnvL } from '@utils/fp'
import { pipe } from 'fp-ts/lib/function'

interface Env {
  db: string
}
const _ = RTE

const getByFormId = (formId: string): ReaderTaskEither<Env, RepositoryError, Survey> =>
  pipe(
    _.fromTaskEither(liftPromise(sleep())),
    _.chain(
      withEnvL(_env => {
        const survey: Survey = {
          id: formId,
          closeDate: '2020-01-01',
          questions: [{ id: 'q1', type: 'select', options: ['test1', 'test2'] }],
        }

        return TE.of(survey)
      }),
    ),
  )

const sleep = () => new Promise(r => setTimeout(() => r(), 1000))

export const surveyRepo = {
  getByFormId,
}
