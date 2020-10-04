import { decodeWith } from '@utils/fp'
import * as D from 'io-ts/Decoder'
import validator from 'validator'

type Answer = D.TypeOf<typeof Answer>
const Answer = D.type({
  questionId: D.string,
  value: D.array(D.string),
})

const Email: D.Decoder<unknown, string> = {
  decode: str => {
    if (typeof str !== 'string') return D.failure(str, 'string')
    return validator.isEmail(str as any) ? D.success(str as string) : D.failure(str, 'email')
  },
}

export type Response = D.TypeOf<typeof Response>
const Response = D.type({
  formId: D.string,
  email: Email,
  answers: D.array(Answer),
})

export const mkResponse = decodeWith(Response)
