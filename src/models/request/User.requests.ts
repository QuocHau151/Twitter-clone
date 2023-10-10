import exp from 'constants'
import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { logoutController } from '~/controllers/users.controllers'

export interface LoginReqBody {
  email: string
  password: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface logoutReqBody {
  refresh_token: string
}
export interface forgotPasswordReqBody {
  email: string
}
export interface resetPasswordReqBody {
  password: string
  confirmPassword: string
  forgot_password_token: string
}
export interface verifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface VerifyEmailReqBody {
  email_verify_token: string
}
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface FollowReqBody {
  followed_user_id: string
}
export interface changePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}
export interface UnFollowPReqParams {
  user_id: string
}
export interface GetProfileParams {
  username: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
