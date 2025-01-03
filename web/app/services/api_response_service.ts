export class ApiResponseService {
  resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
    return {
      code: 0,
      result,
      message,
      type: 'success',
    }
  }

  resultError<T = Recordable>(result: T, { message = 'error' } = {}) {
    return {
      code: 1,
      result,
      message,
      type: 'error',
    }
  }
}
