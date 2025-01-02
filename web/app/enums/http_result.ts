export enum ErrorMsgEnum {
  AUTH_EMAIL_EXIST = 'auth/email_already_exist',
  AUTH_INVALID_CREDENTIALS = 'auth/invalid_credentials',
  AUTH_INVALID_PASSWORD = 'auth/invalid_password',
  AUTH_CODE_SEND = 'auth/code_send_error',
  AUTH_EMAIL_VERIFICATION_ALREADY_SEND = 'auth/email_verification_already_send',
  // -------------------
  SERVER_ERROR = 'system/server_error',
  // -------------------
  USER_NOT_FOUND = 'user/not_found',
  UNAUTHORIZED_ACCESS = 'server/unauthorized_access',
  TOKEN_EXPIRED = 'token/expired',
  RESSOURCE_NOT_FOUND = 'ressource/not_found',
  UNAUTHORIZED_ACCESS_BENEFICARY = 'server/unauthorized_access_beneficiary',
  VALIDATION_FAILURE = 'validation/error',
  ENOENT_ERROR = 'server/enoent_error',
  INVALID_TOKEN = 'auth/invalid_token',
}

export enum SuccessMsgEnum {
  AUTH_LOGIN = 'auth/login_success',
  AUTH_REGISTER = 'auth/register_success',
  AUTH_CODE_SEND = 'auth/code_send_success',
  AUTH_CODE_EMAIL_CODE_SEND = 'auth/code_email_code_send_success',
  AUTH_ACCOUNT_VALIDATE = 'auth/account_validate_success',
  // -------------------
  USER_DELETE = 'user/delete_success',
  USER_PASSWORD_RESET = 'user/password_reset_success',
  USER_EMAIL_RESET = 'user/user_email_reset',
}
