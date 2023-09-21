import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '../utils/handlers'
const usersRouter = express.Router()
/**
 * Description. Login a user
 * Path: /users/login
 * Method: POST
 * Body: {email: string, password: string}
 *
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description. Register a new user
 * Path: /users/register
 * Method: POST
 * Body: {email: string, password: string, confirmPassword: string, date_of_birth: ISO8601}
 *
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * Description. logout a user
 * Path: /users/logout
 * Method: POST
 * headers: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 *
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
export default usersRouter
