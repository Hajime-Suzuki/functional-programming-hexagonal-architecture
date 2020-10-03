import { decodeWith, E } from '@utils/fp'
import { isFuture, isValid } from 'date-fns'
import { flow } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'
import * as shortId from 'shortid'

type QuestionType = D.TypeOf<typeof QuestionType>
const QuestionType = D.literal('select', 'multiple-choice', 'open')

type Question = D.TypeOf<typeof Question>
const Question = D.type({
  id: D.string,
  type: QuestionType,
  options: D.array(D.string),
})

export type Survey = D.TypeOf<typeof Survey>
export const Survey = D.type({
  id: D.string,
  closeDate: D.string,
  questions: D.array(Question),
})

const FutureDate: D.Decoder<unknown, string> = {
  decode: str => {
    if (typeof str !== 'string') return D.failure(str, 'string')
    D.string.decode(str)
    const mayDate = new Date(str)

    if (!isValid(mayDate)) return D.failure(str, 'valid date')
    return isFuture(mayDate) ? D.success(str) : D.failure(str, '> today')
  },
}

const CreateSurveyInput = D.type({
  closeDate: FutureDate,
  questions: D.array(Question),
})

type CreateSurveyInput = D.TypeOf<typeof CreateSurveyInput>

export const mkSurveyFromInput = flow(
  decodeWith(CreateSurveyInput),
  E.map<CreateSurveyInput, Survey>(v => ({ id: shortId.generate(), ...v })),
)
