import * as D from 'io-ts/Decoder'

type Answer = D.TypeOf<typeof Answer>
const Answer = D.type({
  questionId: D.string,
  value: D.array(D.string),
})

export type Response = D.TypeOf<typeof Response>
const Response = D.type({
  formId: D.string,
  email: D.string, // TODO: add custom validation
  answers: D.array(Answer),
})
