import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface TweetRequestBody {
  type: TweetType
  content: string
  audience: TweetAudience
  parent_id: null | string //  chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  medias: Media[]
  hashtags: string[]
  mentions: string[]
}
export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}
export interface TweetQuery extends Pagination, Query {
  tweet_type: string
}

export interface Pagination {
  limit: string
  page: string
}
