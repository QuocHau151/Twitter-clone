import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'
type FilterKeys<T> = (keyof T)[]
export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = pick(req.body, filterKeys)
    req.body = filteredBody
    next()
  }
