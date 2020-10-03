import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import { Decoder, draw } from 'io-ts/Decoder'

export const decodeWith = <A>(decoder: Decoder<unknown, A>) => (
  data: unknown
) => pipe(decoder.decode(data), E.mapLeft(flow(draw, E.toError)))
