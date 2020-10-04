import { NotFoundError } from '@utils/errors/not-found-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { ReaderTaskEither, Option } from '@utils/fp'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Survey, Response, UpdateSurveyInput } from '.'

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
  create: (data: Survey) => ReaderTaskEither<DBPorts, RepositoryError, Survey>
  update: (
    id: Survey['id'],
  ) => (data: UpdateSurveyInput) => ReaderTaskEither<DBPorts, RepositoryError, Survey>
}

export type ResponseRepository = {
  create: (data: Response) => ReaderTaskEither<DBPorts, RepositoryError, Response>
  getByFormId: (formId: string) => ReaderTaskEither<DBPorts, RepositoryError, Response[]>
  getOne: (params: {
    formId: string
    email: string
  }) => ReaderTaskEither<DBPorts, RepositoryError, Option<Response>>
}
