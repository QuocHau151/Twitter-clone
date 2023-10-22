import express from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/request/Tweet.requests'
import { TokenPayload } from '~/models/request/User.requests'
import tweetsService from '~/services/tweets.services'
export const createTweetController = async (
  req: express.Request<ParamsDictionary, any, TweetRequestBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  res.json({
    message: 'Create tweet success',
    result
  })
}
export const getTweetController = async (req: express.Request, res: express.Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views,
    updated_at: result.updated_at,
    views: result.guest_views + result.user_views
  }
  res.json({
    message: 'Get tweet success',
    result: tweet
  })
}
export const getTweetChildrenController = async (
  req: express.Request<TweetParam, any, any, TweetQuery>,
  res: express.Response
) => {
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const user_id = req.decoded_authorization?.user_id
  const { tweet, total } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    page,
    limit,
    user_id
  })
  return res.json({
    message: 'Get tweet children success',
    result: {
      tweet,
      page,
      limit,
      tweet_type,
      total,
      total_pages: Math.ceil(total / limit)
    }
  })
}
export const getNewFeedsController = async (
  req: express.Request<TweetParam, any, any, Pagination>,
  res: express.Response
) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const user_id = req.decoded_authorization?.user_id as string
  const { tweets, total } = await tweetsService.getNewFeeds({ user_id, page, limit })
  return res.json({
    message: 'Get new feeds success',
    result: {
      tweets,
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  })
}
