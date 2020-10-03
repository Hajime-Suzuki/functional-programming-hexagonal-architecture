import { AppError } from './app-error'

export class InputError extends AppError {
  status = 400
}

export const toInputError = (message: string) => new InputError(message)
