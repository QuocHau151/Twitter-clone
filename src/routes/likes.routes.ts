import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '~/controllers/like.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likeRouter = Router()
/**
 * Description. Like a tweet
 * Path: /
 * Method: POST
 * Body: {tweet_id: string}
 *  headers: {Authorization: string}
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)
/**
 * Description. unLike a tweet
 * Path: /tweets/:tweet_id'
 * Method: DELETE
 *  headers: {Authorization: string}
 */
likeRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)
export default likeRouter
