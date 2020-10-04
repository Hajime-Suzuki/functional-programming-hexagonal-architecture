import { surveyRepo } from '@resources'
import { AppError } from '@utils/errors/app-error'
import { InputError } from '@utils/errors/input-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { get, ReaderTaskEither, RTE } from '@utils/fp'
import { flow } from 'fp-ts/lib/function'
import { CommonPorts } from '../../ports'
import { mkSurveyFromInput, Survey } from '../../survey'

const _ = RTE
type Env = CommonPorts
type Payload = {
  input: any
}

type UseCase = (
  payload: Payload,
) => ReaderTaskEither<Env, AppError | RepositoryError | InputError, Survey>

export const createSurvey: UseCase = flow(
  get('input'),
  mkSurveyFromInput,
  _.fromEither,
  _.chainW(surveyRepo.create),
)
