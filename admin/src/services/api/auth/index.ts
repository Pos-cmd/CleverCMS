import { ErrorMessageMode } from '@clever/axios'
import { defHttp } from '@/services/config'
import { LoginParams, LoginResultModel, RegisterParams } from './types'
import { IUser } from '#/model'

enum ApiEnum {
  Prefix = '/auth',
  Login = '/login',
  Register = '/register',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
}

/**
 * @description: user login api
 */
function login(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: ApiEnum.Login,
      params,
    },
    {
      errorMessageMode: mode,
      urlPrefix: ApiEnum.Prefix,
    }
  )
}

/**
 * @description: user register api
 */
function register(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: ApiEnum.Register,
      params,
    },
    {
      errorMessageMode: mode,
      urlPrefix: ApiEnum.Prefix,
    }
  )
}

/**
 * @description: get current user info api
 */
function getUserInfo() {
  return defHttp.get<IUser>(
    { url: ApiEnum.GetUserInfo },
    { errorMessageMode: 'none', urlPrefix: ApiEnum.Prefix }
  )
}

/**
 * @description: logout user api
 */
function doLogout() {
  return defHttp.delete(
    { url: ApiEnum.Logout },
    { errorMessageMode: 'none', urlPrefix: ApiEnum.Prefix }
  )
}

export default {
  login,
  register,
  getUserInfo,
  doLogout,
}
