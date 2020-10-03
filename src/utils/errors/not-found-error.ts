import { AppError } from './app-error'

export class NotFoundError extends AppError {
  status: 404
}

export const toNotFoundError = (message: string) => new NotFoundError(message)
