import express from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import mediasServices from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'
export const uploadImageController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const url = await mediasServices.uploadImage(req)
  return res.status(200).json({
    result: url,
    message: USER_MESSAGE.UPLOAD_SUCCESS
  })
}
export const uploadVideoController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const url = await mediasServices.uploadVideo(req)
  return res.status(200).json({
    result: url,
    message: USER_MESSAGE.UPLOAD_SUCCESS
  })
}
export const serveImageController = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
export const serveVideoStreamController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const range = req.headers.range
  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1MB = 1 * 1024 * 1024 (tính theo hệ nhị phân - binary)
  // 1MB = 1 * 1000 * 1000 (tính theo hệ thập phân - decimal)
  // Dung lượng video = bytes
  const videoSize = fs.statSync(videoPath).size
  // Dung lượng video cho mỗi đoạn stream
  const chunk_size = 10 ** 6 // 1MB
  // lấy giá trị byte ban đầu từ header Range (vd: bytes=1048576)
  const start = Number(range?.replace(/\D/g, ''))
  // lấy giá trị byte kết thúc, vượt quá dung lương video thì lấy giá trị videoSize
  const end = Math.min(start + chunk_size, videoSize - 1)
  // Dung lượng thực tế cho mỗi đoạn video stream
  // THường đây là chunk-size, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
