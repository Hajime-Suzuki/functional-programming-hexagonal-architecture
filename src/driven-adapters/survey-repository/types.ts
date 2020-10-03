import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, TaskEither, TE } from '@utils/fp'
import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

export type SurveyClient = {
  get: (
    PK: PK,
    SK: SK,
  ) => TE.TaskEither<
    RepositoryError | AppError,
    PromiseResult<DocumentClient.GetItemOutput, AWSError>
  >
}

export type WithClient = <R, E, A>(
  fn: (client: SurveyClient) => TaskEither<E, A>,
) => ReaderTaskEither<R, E, A>

export type PK = { __name__: 'survey-pk'; value: string }
export type SK = { __name__: 'survey-sk'; value: 'survey' }
