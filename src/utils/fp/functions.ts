export const flip = <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A) => f(a)(b)
