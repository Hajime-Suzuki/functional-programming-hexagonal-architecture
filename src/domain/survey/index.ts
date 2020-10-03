export type Survey = {
  id: string
  closeDate: string
  questions: Question[]
}

export type QuestionType = 'select' | 'multiple-choice' | 'open'
export type Question = {
  id: string
  type: QuestionType
  options: string[]
}

export type Response = {
  formId: string
  email: string
  answer: Answer[]
}

export type Answer = {
  questionId: string
  value: string[]
}
