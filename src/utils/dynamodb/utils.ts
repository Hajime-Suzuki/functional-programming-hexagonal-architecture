export type DBUpdateInput = {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>

  ExpressionAttributeValues: Record<string, any>
}

export const mkDBUpdateInput = (input: Record<string, any>): DBUpdateInput => {
  const keys = Object.keys(input)

  const output = keys.reduce(
    (exp, key, i) => {
      const separator = i ? ',' : ''
      return {
        UpdateExpression: exp.UpdateExpression + `${separator} #${key} = :${key}`,
        ExpressionAttributeNames: { ...exp.ExpressionAttributeNames, [`#${key}`]: key },
        ExpressionAttributeValues: { ...exp.ExpressionAttributeValues, [`:${key}`]: input[key] },
      }
    },
    {
      UpdateExpression: 'set ',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    } as DBUpdateInput,
  )

  return output
}
