import { useGlobSetting } from '@/composables/setting'
import { $t } from '@/locales'
import { useAuthStoreWithout } from '@/stores/modules/auth'
import { deepMerge, setObjToUrlParams } from '@/utils'
import { localStg } from '@/utils/storage'
import type { AxiosTransform, CreateAxiosOptions, RequestOptions, Result } from '@clever/axios'
import { ContentTypeEnum, RequestEnum, ResultEnum, VAxios } from '@clever/axios'
import { isString } from '@clever/utils'
import type { AxiosResponse } from 'axios'
import { checkStatus } from './checkStatus'
import { formatRequestDate, joinTimestamp } from './helper'

const globSetting = useGlobSetting()
const { urlPrefix } = globSetting
// const { dialog, message: createMessage } = useDiscreteApi()

/**
 * @description: Data processing, easy to distinguish between multiple processing methods
 */
const transform: AxiosTransform = {
  /**
   * @description: Handle request data. If the data is not in the expected format, an error is thrown.
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options

    // Return native response headers, for example: use this attribute when you need to get response headers.
    if (isReturnNativeResponse)
      return res

    // No processing, directly return.
    // Use this when the page code may need to directly get code, data, message, etc.
    if (!isTransformResponse)
      return res.data

    // Return an error if there is no data.
    const { data } = res
    if (!data) {
      throw new Error($t('sys.api.apiRequestFailed'))
    }

    // Here code, result, message are fields standardized by the backend.
    // Change them to the interface return format of your project in types.ts.
    const { code, result, message } = data
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess)
      return result

    let timeoutMsg = ''
    const userStore = useAuthStoreWithout()
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = $t('sys.api.timeoutMessage')
        userStore.setToken(undefined)
        userStore.logout(true)
        break
      default:
        if (message)
          timeoutMsg = message
    }

    if (options.errorMessageMode === 'modal') {
      window?.$dialog?.error({ title: $t('sys.api.errorTip'), content: timeoutMsg, positiveText: $t('common.okText') })
    }
    else if (options.errorMessageMode === 'message') {
      window?.$toast?.error(timeoutMsg)
    }

    throw new Error(timeoutMsg || $t('sys.api.apiRequestFailed'))
  },

  /**
   * @description: Process config before request
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix: configUrlPrefix } = options

    if (joinPrefix)
      config.url = `${configUrlPrefix}${config.url}`

    if (apiUrl && isString(apiUrl))
      config.url = `${apiUrl}${config.url}`

    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      }
      else {
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    }
    else if (!isString(params)) {
      formatDate && formatRequestDate(params)
      if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
        config.data = data
        config.params = params
      }
      else {
        config.data = params
        config.params = undefined
      }
      if (joinParamsToUrl)
        config.url = setObjToUrlParams(config.url as string, { ...config.params, ...config.data })
    }
    else {
      config.url += params
      config.params = undefined
    }
    return config
  },

  /**
   * @description: Request interceptor
   */
  requestInterceptors: (config, options) => {
    const token = localStg.get('token')
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    return config
  },

  /**
   * @description: Response interceptor
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: Handle response errors
   */
  responseInterceptorsCatch: (error: any) => {
    // const errorLogStore = useErrorLogStoreWithOut();
    // errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout')) {
        errMessage = $t('sys.api.apiTimeoutMessage')
      }

      if (err?.includes('Network Error')) {
        errMessage = $t('sys.api.networkExceptionMsg')
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          window?.$dialog?.error({ title: $t('sys.api.errorTip'), content: errMessage , positiveText: $t('common.okText')})
        }
        else if (errorMessageMode === 'message') {
          window?.$toast?.error(errMessage)
        }
        return Promise.reject(error)
      }
    }
    catch (error: any) {
      throw new Error(error)
    }

    checkStatus(error?.response?.status, msg, errorMessageMode)
    return Promise.reject(error)
  },
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // Authentication schemes, e.g., Bearer
        authenticationScheme: 'Bearer',
        // authenticationScheme: '',
        timeout: 10 * 1000,
        // Base API URL
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // If using form-data format
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // Data transformation methods
        transform,
        // Configuration options, the following options can be overridden in individual interface requests
        requestOptions: {
          // Add prefix to URL by default
          joinPrefix: true,
          // Return the native response headers, e.g., use this property when you need to get response headers
          isReturnNativeResponse: false,
          // Need to process the returned data
          isTransformResponse: true,
          // Add parameters to URL in POST request
          joinParamsToUrl: false,
          // Format the submission parameter time
          formatDate: true,
          // Message prompt type
          errorMessageMode: 'message',
          // API URL
          apiUrl: globSetting.apiUrl,
          // URL prefix
          urlPrefix,
          // Whether to add a timestamp
          joinTime: true,
          // Ignore duplicate requests
          ignoreCancelToken: true,
          // Whether to carry a token
          withToken: true,
        },
      },
      opt || {},
    ),
  )
}

export const defHttp = createAxios()
