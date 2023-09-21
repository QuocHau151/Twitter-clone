export const USER_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_MUST_BE_A_STRING: 'Email must be a string',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_LENGTH_MUST_BE_FROM_1_TO_100: 'Email length must be from 1 to 100',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_IS_INCORRECT: 'Password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Password length must be from 8 to 100',
  PASSWORD_MUST_BE_A_STRING:
    'Password must be 8-100 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Confirm password length must be from 8 to 100',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',
  CONFIRM_PASSWPRD_MUST_BE_SAME_AS_PASSWORD: 'Confirm password must be same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_IS_USED_OR_NOT_EXIST: 'Refresh token is used or not exist',
  LOGOUT_SUCCESS: 'Logout success'
} as const
