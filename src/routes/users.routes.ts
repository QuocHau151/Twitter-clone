import express from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unFollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  UpdateMeValidator,
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '../utils/handlers'
import { filterMiddleware } from '~/middlewares/common.middleware'
import { UpdateMeReqBody } from '~/models/request/User.requests'
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
 * Description. OAth with google
 * Path: /oath/google
 * Method: GET
 * Body: {email: string, password: string}
 *
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
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
/**
 * Description. Verify a user's email
 * Path: /users/verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 *
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
/**
 * Description. Resend verify email
 * Path: /users/resend-verify-email
 * Method: POST
 * Body: {resend-email_verify_token: string}
 *
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
/**
 * Description. Forgot password
 * Path: /users/forgot-password
 * Method: POST
 * Body: {email: string}
 *
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
/**
 * Description. Verify Forgot password
 * Path: /users/verify-forgot-password
 * Method: POST
 * Body: {email: string}
 *
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)
/**
 * Description. Reset password
 * Path: /users/reset-password
 * Method: POST
 * Body: {password: string, confirmPassword: string, forgot_password_token: string}
 *
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
/**
 * Description. Get user info
 * Path: /users/me
 * Method: GET
 * Body: {Authorization: Bearer <access_token>}
 *
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
/**
 * Description. Update user info
 * Path: /users/me
 * Method: PATH
 * Body: {Authorization: Bearer <access_token>}
 * Headers: {name: string, email: string, date_of_birth: ISO8601, bio: string, location: string, website: string, username: string, avatar: string, cover_photo: string}
 *
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  UpdateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)
/**
 * Description. Get username profile
 * Path: /:username
 * Method: GET
 * Body: {Authorization: Bearer <access_token>}
 *
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description. Get following users
 * Path: /follow
 * Method: GET
 *  Header: {Authorization: Bearer <access_token>}
 * Body: {user_id: string}
 *
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)
/**
 * Description. Delete following users
 * Path: /follow/user_id
 * Method:  DELETE
 *  Header: {Authorization: Bearer <access_token>}
 *
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)
/**
 * Description. Change password
 * Path: /change-password
 * Method:  PUT
 *  Header: {Authorization: Bearer <access_token>}
 *  Body: {old_password: string, new_password: string, confirm_password: string}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
export default usersRouter
