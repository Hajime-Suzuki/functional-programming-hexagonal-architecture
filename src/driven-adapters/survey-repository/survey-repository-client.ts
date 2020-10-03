import { Survey } from '@core/survey'
import { DBPorts } from '@core/survey/ports'
import { AppError } from '@utils/errors/app-error'
import { toRepositoryError } from '@utils/errors/repository-error'
import { liftPromise, ReaderTaskEither, RTE, TE, withEnv } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'
import { PK, SK, SurveyClient, WithClient } from './types'

export const toPK = (id: Survey['id']): PK => ({ __name__: 'survey-pk', value: 'survey_' + id })
export const toSK = (): SK => ({ __name__: 'survey-sk', value: 'survey' })

const getClient: ReaderTaskEither<DBPorts, AppError, SurveyClient> = withEnv(({ db }) => {
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

export const withClient: WithClient = f =>
  pipe(getClient, RTE.chain(flow(f, RTE.fromTaskEither)) as any)
