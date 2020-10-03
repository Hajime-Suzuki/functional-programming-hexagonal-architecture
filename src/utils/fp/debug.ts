export const debug = (process: string) => <A>(data: A) => {
  console.log(`${process}: ${JSON.stringify(data, null, 2)}`)
  return data
}
