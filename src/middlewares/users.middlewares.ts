import e from 'express'
import express from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { head } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validator'
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new Error(USER_MESSAGE.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ password: hashPassword(req.body.password) })
            if (user === null) {
              throw new Error(USER_MESSAGE.PASSWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.EMAIL_MUST_BE_A_STRING
        },
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isEmailExitst = await usersService.checkEmailExist(value)
            if (isEmailExitst) {
              throw new Error(USER_MESSAGE.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.CONFIRM_PASSWPRD_MUST_BE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USER_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601
        }
      }
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      notEmpty: {
        errorMessage: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      },
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              req.decoded_authorization = decoded_authorization
            } catch {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_IS_USED_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
