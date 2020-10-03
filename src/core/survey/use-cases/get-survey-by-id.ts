import { surveyRepo } from '@resources'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, withEnv } from '@utils/fp'
import { CommonPorts } from '../ports'
import { Survey } from '../survey'

type Env = CommonPorts

type Payload = {
  formId: string
}

export const getSurveyById = (
  payload: Payload,
): ReaderTaskEither<Env, AppError | RepositoryError, Survey> =>
  withEnv(surveyRepo.getByFormId(payload.formId))
