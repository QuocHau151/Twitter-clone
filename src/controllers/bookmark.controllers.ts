import express from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BookmarkTweetReqBody } from '~/models/request/Bookmark.requests'
import { TokenPayload } from '~/models/request/User.requests'
import bookmarkService from '~/services/bookmark.services'
export const bookmarkTweetController = async (
  req: express.Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await bookmarkService.bookmarkTweet(user_id, tweet_id)
  res.json({
    message: 'Bookmark tweet success',
    result
  })
}
export const unbookmarkTweetController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.params
  const result = await bookmarkService.unbookmarkTweet(user_id, tweet_id)
  res.json({
    message: 'UnBookmark tweet success'
  })
}
