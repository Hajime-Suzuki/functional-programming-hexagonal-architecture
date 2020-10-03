import { AppError } from './app-error'

export class RepositoryError extends AppError {}

export const toRepositoryError = (e: unknown) => {
  console.error('RepositoryError:', e)
  if (e instanceof Error) {
    return new RepositoryError(e.message || 'unexpected error')
  }
  return new RepositoryError(((e as Error).message as string) || 'unexpected error')
}
