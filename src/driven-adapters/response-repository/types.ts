import { Client } from '@utils/dynamodb'
import { Response } from '@core/survey'
export type ResponseClient = Client<DBKey, DBResponse>

export type PK = string
export type SK = string
export type DBKey = { PK: PK; SK: SK }

export type DBResponse = {
  PK: PK
  SK: SK
} & Pick<Response, 'email' | 'answers'>
