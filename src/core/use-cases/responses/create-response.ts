import { mkResponse, Response } from '@core'
import { CommonPorts } from '@core/ports'
import { surveyRepo } from '@resources'
import { responseRepo } from '@resources/response-repository/response-repository'
import { AppError, toAppError } from '@utils/errors/app-error'
import { NotFoundError } from '@utils/errors/not-found-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { get, O, ReaderTaskEither, RTE } from '@utils/fp'
import { flow, pipe } from 'fp-ts/lib/function'

const _ = RTE

type Env = CommonPorts

type Payload = {
  input: any
}

type UseCase = (
  payload: Payload,
) => ReaderTaskEither<Env, AppError | RepositoryError | NotFoundError, Response>

export const createResponse: UseCase = flow(
  flow(get('input'), mkResponse, _.fromEither),
  _.chain(decoded =>
    pipe(
      responseRepo.getOne(decoded),
      _.chain(
        O.fold(
          () => _.right(undefined),
          () => _.left(toAppError('user has already sent')),
        ),
      ),
      _.chain(() => surveyRepo.getByFormId(decoded.formId)),
      _.chain(() => responseRepo.create(decoded)),
    ),
  ),
)
