import { IS_OFFLINE } from '@utils/constants'
import { DynamoDB } from 'aws-sdk'

export const dbClient = new DynamoDB.DocumentClient(
  IS_OFFLINE
    ? {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      }
    : {},
)
