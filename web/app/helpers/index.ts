import { ErrorMsgEnum } from '#enums/http_result'

export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: 'success',
  }
}

export function resultError(
  message = 'Request failed',
  {
    code = -1,
    result = null,
  }: { code: number | string | ErrorMsgEnum; result: null | undefined } | Recordable = {}
) {
  return {
    code,
    result,
    message,
    type: 'error',
  }
}

export function escapeJSONString(jsonString: string): string {
  return jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'")
}
