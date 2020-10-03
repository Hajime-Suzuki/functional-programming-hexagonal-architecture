import * as D from 'io-ts/Decoder'

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
