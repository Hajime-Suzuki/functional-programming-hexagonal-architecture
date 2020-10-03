import { Survey } from '@core/survey'
import { Env } from '@core/survey/use-cases'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError, toRepositoryError } from '@utils/errors/repository-error'
import { liftPromise, ReaderTaskEither, TE, withEnv } from '@utils/fp'
import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

type SurveyClient = {
  get: (
    PK: PK,
    SK: SK,
  ) => TE.TaskEither<
    RepositoryError | AppError,
    PromiseResult<DocumentClient.GetItemOutput, AWSError>
  >
}

export type PK = { __name__: 'survey-pk'; value: string }
export type SK = { __name__: 'survey-sk'; value: 'survey' }

export const toPK = (id: Survey['id']): PK => ({ __name__: 'survey-pk', value: 'survey_' + id })
export const toSK = (): SK => ({ __name__: 'survey-sk', value: 'survey' })

export const getClient: ReaderTaskEither<Env, AppError, SurveyClient> = withEnv(({ db }) => {
  const get = (PK: PK, SK: SK) => {
    const res = db.client
      .get({
        TableName: db.tableName,
        Key: { PK: PK.value, SK: SK.value },
      })
      .promise()

    return liftPromise(res, toRepositoryError)
  }

  return TE.of({
    get,
  })
})
