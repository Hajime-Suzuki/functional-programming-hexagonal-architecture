export class AppError extends Error {
  status = 500
}

export const toAppError = (e: unknown) => {
  if (e instanceof Error) {
    return new AppError(e.message)
  }
  if (typeof e === 'string') {
    return new AppError(e)
  }

  return new AppError('AppError: unexpected error')
}
