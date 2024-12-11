import getUser from '../controllers/user/getUser.js'
import rotateApiKey from '../controllers/user/rotateApiKey.js'
import newsletter from '../controllers/user/newsletter.js'
import { verifyToken } from '../utils/auth/verifyToken.js'
import getOauthLink from '../controllers/user/getOauthLink.js'
import getMagicLink from '../controllers/user/getMagicLink.js'
import handleOauth from '../controllers/user/handleOauth.js'
import handleOauthCallback from '../controllers/user/handleOauthCallback.js'
import updateOrg from '../controllers/user/updateOrg.js'
export default (app) => {
  app.post('/user/rotateApiKey', verifyToken, rotateApiKey)
  app.post('/user/newsletter', newsletter)
  app.get('/user/oauth', getOauthLink)
  app.post('/oauth/:provider', handleOauth)
  app.get('/oauth/:provider', handleOauthCallback)
  app.get('/user/link', getMagicLink)
  app.get('/user', verifyToken, getUser)
  app.post('/org', verifyToken, updateOrg)
}
