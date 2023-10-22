import express, { RequestHandler } from 'express'
export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
  return async (req: express.Request<P>, res: express.Response, next: express.NextFunction) => {
    try {
      await func(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
