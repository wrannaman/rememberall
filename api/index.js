import { pg } from './connections/index.js'
import { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import bootstrap from './bootstrap.js'

const app = express()
app.use(cors())
app.use(express.json())

routes(app)

let server = null

const interval = setInterval(() => {
  if (!global?.db_ready) return
  clearInterval(interval)
  bootstrap()
  server = app.listen(process.env.PORT || 3001, () => {
    console.log(`Server listening on port ${process.env.PORT || 3001}`)
  })
}, 200)

console.log('🚀 Starting API')

export { app, server }