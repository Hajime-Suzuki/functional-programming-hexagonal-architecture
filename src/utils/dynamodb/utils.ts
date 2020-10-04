import { DBPorts } from '@core/ports'
import { RepositoryError, toRepositoryError } from '@utils/errors/repository-error'
import { withEnv, liftPromise, TE, RTE, ReaderTaskEither } from '@utils/fp'
import { pipe, flow } from 'fp-ts/lib/function'
import { Client, WithClient } from './types'

const getClient: ReaderTaskEither<DBPorts, RepositoryError, Client<any, any, any>> = withEnv(
  ({ db }) => {
    const get: Client['get'] = payload => {
      const res = db.client
        .get({
          TableName: db.tableName,
          ...payload,
        })
        .promise()

      return liftPromise(res, toRepositoryError)
    }

    const create: Client['create'] = data => {
      const res = db.client
        .put({
          TableName: db.tableName,
          Item: data,
        })
        .promise()

      return liftPromise(res, toRepositoryError)
    }

    const update: Client['update'] = (Key, data) => {
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

    const query: Client['query'] = input => {
      console.log(input)
      const res = db.client
        .query({
          TableName: db.tableName,
          ...input,
        })
        .promise()

      return liftPromise(res, toRepositoryError)
    }

    return TE.of({
      get,
      create,
      update,
      query,
    })
  },
)

export const withClient: WithClient<any> = f =>
  pipe(getClient, RTE.chain(flow(f, RTE.fromTaskEither)) as any)

export type DBUpdateInput = {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>

  ExpressionAttributeValues: Record<string, any>
}

export const mkDBUpdateInput = (input: Record<string, any>): DBUpdateInput => {
  const keys = Object.keys(input)

  const output = keys.reduce(
    (exp, key, i) => {
      const separator = i ? ',' : ''
      return {
        UpdateExpression: exp.UpdateExpression + `${separator} #${key} = :${key}`,
        ExpressionAttributeNames: { ...exp.ExpressionAttributeNames, [`#${key}`]: key },
        ExpressionAttributeValues: { ...exp.ExpressionAttributeValues, [`:${key}`]: input[key] },
      }
    },
    {
      UpdateExpression: 'set ',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    } as DBUpdateInput,
  )

  return output
}
