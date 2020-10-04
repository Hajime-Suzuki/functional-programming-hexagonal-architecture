import { Response } from '@core'
import { QueryPayload } from '@utils/dynamodb'
import {
  fromPK as fromSurveyPK,
  toPK as toSurveyPK,
} from '../survey-repository/survey-transformation'
import { DBKey, DBResponse, PK, SK } from './types'

export const toResponse = (data: DBResponse): Response => {
  return {
    formId: fromPK(data.PK),
    email: data.email,
    answers: data.answers,
  }
}

export const fromResponse = (data: Response): DBResponse => {
  return {
    PK: toPK(data.formId),
    SK: toSK(data.email),
    email: data.email,
    answers: data.answers,
  }
}

const SKPrefix = 'response_'
const toPK = (formId: Response['formId']): PK => toSurveyPK(formId)
const fromPK = fromSurveyPK
const toSK = (email: Response['email']): SK => SKPrefix + email

export const mkDBKey = ({ formId, email }: Pick<Response, 'formId' | 'email'>): DBKey => ({
  PK: toPK(formId),
  SK: toSK(email),
})

export const mkGetByFormIdCondition = (formId: string): QueryPayload => ({
  KeyConditionExpression: `PK = :PK and begins_with (SK, :SKPrefix)`,
  ExpressionAttributeValues: { ':PK': toPK(formId), ':SKPrefix': SKPrefix },
})
