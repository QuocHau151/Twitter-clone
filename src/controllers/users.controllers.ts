import express from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  FollowReqBody,
  LoginReqBody,
  RegisterReqBody,
  TokenPayload,
  UpdateMeReqBody,
  VerifyEmailReqBody,
  forgotPasswordReqBody,
  logoutReqBody,
  resetPasswordReqBody
} from '~/models/request/User.requests'
import { USER_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'
import { verify } from 'crypto'
import { GetProfileParams } from '../models/request/User.requests'

export const loginController = async (
  req: express.Request<ParamsDictionary, any, LoginReqBody>,
  res: express.Response
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: express.Request<ParamsDictionary, any, RegisterReqBody>,
  res: express.Response
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}
export const logoutController = async (
  req: express.Request<ParamsDictionary, any, logoutReqBody>,
  res: express.Response
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
export const verifyEmailController = async (
  req: express.Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // Nếu không tìm thấy user thì báo lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }
  // Đã verify rồi thì mình không báo lỗi
  // Mà mình sẽ trả về status 200 và message là đã verify trước đó rồi
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendVerifyEmailController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // Nếu không tìm thấy user thì báo lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }
  // Đã verify rồi thì mình không báo lỗi
  // Mà mình sẽ trả về status 200 và message là đã verify trước đó rồi
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  return res.json(result)
}
export const forgotPasswordController = async (
  req: express.Request<ParamsDictionary, any, forgotPasswordReqBody>,
  res: express.Response
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}
export const verifyForgotPasswordTokenController = async (
  req: express.Request<ParamsDictionary, any, forgotPasswordReqBody>,
  res: express.Response
) => {
  return res.json({
    message: USER_MESSAGE.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}
export const resetPasswordController = async (
  req: express.Request<ParamsDictionary, any, resetPasswordReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const result = await usersService.resetPassword(user_id, req.body.password)
  return res.json({
    result,
    message: USER_MESSAGE.RESET_PASSWORD_SUCCESS
  })
}
export const getMeController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(user_id)
  return res.json(user)
}
export const getProfileController = async (req: express.Request<GetProfileParams>, res: express.Response) => {
  const { username } = req.params
  const user = await usersService.getProfile(username)
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESS,
    result: user
  })
}
export const updateMeController = async (
  req: express.Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req

  const user = await usersService.updateMe(user_id, body)
  return res.json({
    message: USER_MESSAGE.UPDATE_MY_PROFILE_SUCCESS,
    result: user
  })
}
export const followController = async (
  req: express.Request<ParamsDictionary, any, FollowReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(user_id, followed_user_id)
  return res.json({
    result
  })
}
