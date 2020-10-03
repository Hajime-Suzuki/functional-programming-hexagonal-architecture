import { flip } from '../functions'

describe('utils', () => {
  describe('fp functions', () => {
    describe('flip', () => {
      test('works correctly', () => {
        const f = (a: number) => (b: boolean) => (b ? a : a * -1)
        const res = f(10)(true)
        const res2 = flip(f)(true)(10)
        expect(res).toBe(res2)
      })
    })
  })
})
