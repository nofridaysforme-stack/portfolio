import express from 'express'
import next from 'next'
import payload from 'payload'
import dotenv from 'dotenv'

dotenv.config()

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

const app = express()

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Initialize Next.js
  const nextApp = next({ dev })
  const nextHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  // Handle Next.js requests
  app.get('*', (req, res) => nextHandler(req, res))

  app.listen(port, () => {
    payload.logger.info(`Next.js App URL: http://localhost:${port}`)
  })
}

start()
