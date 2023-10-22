import { Router } from 'express'
import { wrap } from 'module'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmark.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouter = Router()
/**
 * Description. Bookmark a tweet
 * Path: /
 * Method: POST
 * Body: {tweet_id: string}
 *  headers: {Authorization: string}
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)
/**
 * Description. unBookmark a tweet
 * Path: /tweets/:tweet_id'
 * Method: DELETE
 * Body: {tweet_id: string}
 *  headers: {Authorization: string}
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)
export default bookmarksRouter
