import { Survey, mkUpdateSurveyInput } from '@core/survey'
import { CommonPorts } from '@core/ports'
import { surveyRepo } from '@resources'
import { InputError } from '@utils/errors/input-error'
import { NotFoundError } from '@utils/errors/not-found-error'
import { RepositoryError } from '@utils/errors/repository-error'
import { constInput, get, ReaderTaskEither, RTE } from '@utils/fp'
import { Do } from 'fp-ts-contrib/lib/Do'
import { flow, pipe } from 'fp-ts/lib/function'

const _ = RTE

type Env = CommonPorts
type Payload = { formId: string; input: unknown }

type UseCase = (
  payload: Payload,
) => ReaderTaskEither<Env, InputError | RepositoryError | NotFoundError, Survey>

export const updateSurvey: UseCase = ({ input, formId }) =>
  pipe(
    _.fromEither(mkUpdateSurveyInput(input)),
    _.chain(constInput(surveyRepo.getByFormId(formId))),
    _.chain(surveyRepo.update(formId)),
  )

const _updateSurveyWithDoNotation: UseCase = payload =>
  Do(RTE.readerTaskEither)
    .bind('input', _.fromEither(mkUpdateSurveyInput(payload.input)))
    .do(surveyRepo.getByFormId(payload.formId))
    .bindL('res', flow(get('input'), surveyRepo.update(payload.formId)))
    .return(({ res }) => {
      return res
    })
