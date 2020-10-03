import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, RTE } from '@utils/fp'
import { pipe } from 'fp-ts/lib/function'
import { CommonPorts } from '../ports'
import { mkSurveyFromInput, Survey } from '../survey'

const _ = RTE
type Env = CommonPorts
type Payload = {
  input: any
}
export const createSurvey = (
  payload: Payload,
): ReaderTaskEither<Env, AppError | RepositoryError, Survey> => {
  const res = mkSurveyFromInput(payload.input)

  return pipe(_.fromEither(res))
}
