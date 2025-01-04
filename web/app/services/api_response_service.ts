import { ErrorResponse, SuccessResponse } from '#types/api_response'
export class ApiResponseService {
  resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}): SuccessResponse<T> {
    return {
      code: 0,
      result,
      message,
      type: 'success',
    }
  }

  resultError<T = Recordable>(result: T, { message = 'error' } = {}): ErrorResponse<T> {
    return {
      code: 1,
      result,
      message,
      type: 'error',
    }
  }
}
