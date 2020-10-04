import { Survey } from '@core/survey'
import { CommonPorts } from '@core/ports'
import { surveyRepo } from '@resources'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { get, ReaderTaskEither, withEnv } from '@utils/fp'
import { flow } from 'fp-ts/lib/function'

type Env = CommonPorts

type Payload = {
  formId: string
}

type UseCase = (payload: Payload) => ReaderTaskEither<Env, AppError | RepositoryError, Survey>

export const getSurveyById: UseCase = flow(get('formId'), surveyRepo.getByFormId, withEnv)
