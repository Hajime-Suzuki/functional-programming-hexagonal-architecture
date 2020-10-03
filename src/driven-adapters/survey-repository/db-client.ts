import { DBPorts } from '@core/survey/ports'
import { WithClient } from '@resources/types'
import { RepositoryError, toRepositoryError } from '@utils/errors/repository-error'
import { liftPromise, ReaderTaskEither, RTE, TE, withEnv } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { DBSurvey, PK, SK, SurveyClient } from './types'

const getClient: ReaderTaskEither<DBPorts, RepositoryError, SurveyClient> = withEnv(({ db }) => {
  const get = (PK: PK, SK: SK) => {
    const res = db.client
      .get({
        TableName: db.tableName,
        Key: { PK: PK.value, SK: SK.value },
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

  return TE.of({
    get,
    create,
  })
})

export const withClient: WithClient<SurveyClient> = f =>
  pipe(getClient, RTE.chain(flow(f, RTE.fromTaskEither)) as any)
