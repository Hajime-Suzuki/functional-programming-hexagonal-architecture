import { NotFoundError } from '@utils/errors/not-found-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Survey } from '.'

export type CommonPorts = DBPorts

export type DBPorts = {
  db: {
    client: DocumentClient
    tableName: string
  }
}

export type SurveyRepository = {
  getByFormId: (
    formId: string,
  ) => ReaderTaskEither<DBPorts, RepositoryError | NotFoundError, Survey>
}
