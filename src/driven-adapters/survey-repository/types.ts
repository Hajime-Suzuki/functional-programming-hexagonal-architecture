import { RepositoryError } from '@utils/errors/repository-error'
import { TaskEither } from '@utils/fp'
import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

export type SurveyClient = {
  get: (
    PK: PK,
    SK: SK,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.GetItemOutput, AWSError>>

  create: (
    data: DBSurvey,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.PutItemOutput, AWSError>>
}

export type PK = { __name__: 'survey-pk'; value: string }
export type SK = { __name__: 'survey-sk'; value: 'survey' }

export type DBSurvey = {
  SK: string
  PK: string
  closeDate: string
  questions: {
    type: string
    options: string[]
    id: string
  }[]
}
