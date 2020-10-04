import { Response } from '@core'
import { CommonPorts } from '@core/ports'
import { responseRepo } from '@resources/response-repository/response-repository'
import { AppError } from '@utils/errors/app-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { get, ReaderTaskEither, withEnv } from '@utils/fp'
import { flow } from 'fp-ts/lib/function'

type Env = CommonPorts

type Payload = {
  formId: string
}

type UseCase = (payload: Payload) => ReaderTaskEither<Env, AppError | RepositoryError, Response[]>

export const getByFormId: UseCase = flow(get('formId'), responseRepo.getByFormId, withEnv)
