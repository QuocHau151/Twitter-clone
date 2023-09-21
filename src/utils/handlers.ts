import express, { RequestHandler } from 'express'
export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await func(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
