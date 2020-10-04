import { DBPorts } from '@core/survey/ports'
import { WithClient } from '@resources/types'
import { DBUpdateInput } from '@utils/dynamodb/utils'
import { RepositoryError, toRepositoryError } from '@utils/errors/repository-error'
import { liftPromise, ReaderTaskEither, RTE, TE, withEnv } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { DBKey, DBSurvey, SurveyClient } from './types'

const getClient: ReaderTaskEither<DBPorts, RepositoryError, SurveyClient> = withEnv(({ db }) => {
  const get = (Key: DBKey) => {
    const res = db.client
      .get({
        TableName: db.tableName,
        Key,
      })
      .promise()

    return liftPromise(res, toRepositoryError)
  }

  const create = (data: DBSurvey) => {
    const res = db.client
      .put({
        TableName: db.tableName,
        Item: data,
      })
      .promise()

    return liftPromise(res, toRepositoryError)
  }

  const update = (Key: DBKey) => (data: DBUpdateInput) => {
    const res = db.client
      .update({
        TableName: db.tableName,
        Key,
        ReturnValues: 'ALL_NEW',
        ...data,
      })
      .promise()

    return liftPromise(res, toRepositoryError)
  }

  return TE.of({
    get,
    create,
    update,
  })
})

export const withClient: WithClient<SurveyClient> = f =>
  pipe(getClient, RTE.chain(flow(f, RTE.fromTaskEither)) as any)
