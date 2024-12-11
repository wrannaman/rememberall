import { verifyToken } from '../utils/auth/verifyToken.js'
import processMedia from '../controllers/media/processMedia.js'
export default (app) => {
  app.post('/media/process', verifyToken, processMedia)
}
