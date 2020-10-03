import { toApiGatewayResponse } from '@utils/api-gateway'
import { E } from '@utils/fp'

export const handler = async () => {
  return toApiGatewayResponse()(E.right({ test: 'yes' }))
}
