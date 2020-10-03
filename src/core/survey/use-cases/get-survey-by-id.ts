import { surveyRepo } from '@resources'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, withEnv } from '@utils/fp'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Survey } from '../survey'

export type Env = {
  db: {
    client: DocumentClient
    tableName: string
  }
}

type Payload = {
  formId: string
}
export const getSurveyById = (
  payload: Payload,
): ReaderTaskEither<Env, AppError | RepositoryError, Survey> =>
  withEnv(surveyRepo.getByFormId(payload.formId))
