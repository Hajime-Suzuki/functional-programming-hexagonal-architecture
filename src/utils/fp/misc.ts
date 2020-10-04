export const singleton = <K extends string, V>(k: K) => (a: V) => ({ [k]: a } as Record<K, V>)

export const get = <K extends string>(key: K) => {
  function getter<T extends { [P in K]?: any }>(data: T): T[typeof key]
  function getter<T extends { [P in K]: any }>(data: T) {
    return data[key]
  }

  return getter
}
