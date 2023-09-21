import express from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
const defaultErrorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    omit({
      message: err.message,
      errorInfo: omit(err, ['stack'])
    })
  )
}
export default defaultErrorHandler
