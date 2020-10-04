import { DBUpdateInput } from '@utils/dynamodb/utils'
import { RepositoryError } from '@utils/errors/repository-error'
import { TaskEither } from '@utils/fp'
import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

export type SurveyClient = {
  get: (
    key: DBKey,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.GetItemOutput, AWSError>>

  create: (
    data: DBSurvey,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.PutItemOutput, AWSError>>

  update: (
    key: DBKey,
  ) => (
    data: DBUpdateInput,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>
}

export type PK = string
export type SK = '#survey'
export type DBKey = { PK: PK; SK: SK }

export type DBSurvey = {
  PK: PK
  SK: SK
  closeDate: string
  questions: {
    type: string
    options: string[]
    id: string
  }[]
}
