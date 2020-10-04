import { Survey } from '@core/survey'
import { Client } from '@utils/dynamodb/types'
import { DBUpdateInput } from '@utils/dynamodb/utils'

export type SurveyClient = Client<DBKey, DBSurvey, DBUpdateInput>

export type PK = string
export type SK = '#survey'
export type DBKey = { PK: PK; SK: SK }

export type DBSurvey = {
  PK: PK
  SK: SK
} & Pick<Survey, 'closeDate' | 'questions'>
