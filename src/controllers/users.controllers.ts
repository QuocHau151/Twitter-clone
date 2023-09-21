import express from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/request/User.requests'
import { USER_MESSAGE } from '~/constants/message'

export const loginController = async (req: express.Request, res: express.Response) => {
  const { user } = req
  const user_id = user._id.toString()

  const result = await usersService.login(user_id)
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
export const logoutController = async (req: express.Request, res: express.Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
