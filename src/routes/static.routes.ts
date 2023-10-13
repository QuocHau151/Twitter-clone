import express from 'express'
import { serveImageController, serveVideoStreamController } from '~/controllers/medias.controllers'
const serveRouter = express.Router()
serveRouter.get('/image/:name', serveImageController)
serveRouter.get('/video/:name', serveVideoStreamController)
export default serveRouter
