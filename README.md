# Functional programming way of hexagonal architecture

Hexagonal architecture for survey application. There are `Survey` and `Response`

---

## Goals

- show examples with fp-ts
- keep it simple

---

## Functionalities

- user can create survey
- user can update survey
- user can get survey by form id

- user can create response for specific survey
- user can get all responses for specific survey

---

## API

sample-request.http can be used for test requests with VSCode REST Client extension.

### Survey

GET: /surveys/{formId}  
response: Survey

POST: /surveys
response: Survey

PUT: /surveys/{formId}  
response: Survey

### Response

GET: /surveys/{formId}/responses  
response: Response[]

POST: /responses  
response: Response

```
type Survey = {
  id: string
  closeDate: string
  questions: {
      id: string
      type: "select" | "multiple-choice" | "open"
      options: string[]
  }[]
}

```

```
type Response = {
  formId: string
  email: string
  answers: {
      questionId: string
      value: string[]
  }[];
}
```

---

## How to run

- serverless-dynamodb-local is used, so Java Runtime Engine (JRE) version 6.x or newer is required (https://www.serverless.com/plugins/serverless-dynamodb-local)
- run `yarn install`
- run `yarn dev`
