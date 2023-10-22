import express from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BookmarkTweetReqBody } from '~/models/request/Bookmark.requests'
import { LikeTweetReqBody } from '~/models/request/Like.requests'
import { TokenPayload } from '~/models/request/User.requests'
import bookmarkService from '~/services/bookmark.services'
import likeService from '~/services/likes.services'
export const likeTweetController = async (
  req: express.Request<ParamsDictionary, any, LikeTweetReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await likeService.likeTweet(user_id, tweet_id)
  res.json({
    message: 'Like tweet success',
    result
  })
}
export const unlikeTweetController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.params
  const result = await likeService.unlikeTweet(user_id, tweet_id)
  res.json({
    message: 'UnLike tweet success'
  })
}
