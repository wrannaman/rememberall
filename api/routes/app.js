import { verifyToken } from '../utils/auth/verifyToken.js'
import {
  getMemories,
  createMemory,
  deleteMemory
} from '../controllers/app/app.js'

export default (app) => {
  app.get('/memories', verifyToken, getMemories)
  app.post('/memory', verifyToken, createMemory)
  app.delete('/memory/:id', verifyToken, deleteMemory)
}
