import { surveyRepo } from '@resources'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, withEnv } from '@utils/fp'
import { pipe } from 'fp-ts/lib/function'
import { Survey } from '../survey'

type Env = {
  db: any
}
type Payload = {
  formId: string
}
export const getSurveyById = (
  payload: Payload,
): ReaderTaskEither<Env, AppError | RepositoryError, Survey> =>
  pipe(withEnv(surveyRepo.getByFormId(payload.formId)))
