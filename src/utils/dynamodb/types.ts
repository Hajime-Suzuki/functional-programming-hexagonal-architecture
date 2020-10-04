import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, TaskEither } from '@utils/fp'
import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

export type WithClient<TClient> = <R, E, A>(
  fn: (client: TClient) => TaskEither<E, A>,
) => ReaderTaskEither<R, E, A>

export type QueryPayload = Omit<DocumentClient.QueryInput, 'TableName'>

export type Client<
  Key = Record<string, any>,
  CreateInput = Record<string, any>,
  UpdateInput = Record<string, any>
> = {
  get: (
    payload: Omit<DocumentClient.GetItemInput, 'TableName'>,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.GetItemOutput, AWSError>>

  create: (
    data: CreateInput,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.PutItemOutput, AWSError>>

  query: (
    payload: QueryPayload,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.QueryOutput, AWSError>>

  update: (
    key: Key,
    data: UpdateInput,
  ) => TaskEither<RepositoryError, PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>
}
