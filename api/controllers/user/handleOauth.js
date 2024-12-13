import { pg } from '../../connections/index.js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OAuth2 = google.auth.OAuth2;
let google_oauth = fs.readFileSync(path.join(__dirname, '../../google_oauth.json'), 'utf8');
google_oauth = JSON.parse(google_oauth)
const redirectIndex = process.env.ENV === 'production' ? 1 : 0

export default async (req, res) => {
  const { User, Org } = pg.models
  try {
    const { code } = req.body
    let { redirect } = req.body
    if (redirect) redirect = redirect.replace('app-stage', 'app')
    const oauth2Client = new OAuth2(google_oauth.web.client_id, google_oauth.web.client_secret, redirect || google_oauth.web.redirect_uris[redirectIndex]);
    const tok = await oauth2Client.getToken(code)
    if (!tok.tokens) return res.status(500).json({ error: 'No token' })
    oauth2Client.setCredentials({ access_token: tok.tokens.access_token });
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    const u = await oauth2.userinfo.get()
    const { email, verified_email, given_name, family_name, picture } = u.data
    // see if user exists. if not, create them 
    let user = await User.findOne({ where: { email } })
    if (!user) {
      let org = await Org.findOne({ where: { name: 'Default' } });
      if (!org) org = await Org.create({ name: 'Default' })
      user = await User.create({ email, name: `${given_name} ${family_name}`, photo: picture, OrgId: org?.id })

      try {
        await axios.post('https://hooks.slack.com/services/xx/xx/xx', {
          text: `email validation api new user - ${user.email}`
        })
      } catch (e) {
        console.error('slack error')
      }
    }
    const token = jwt.sign({ UserId: user.id, email: user.email }, process.env.JWT_SECRET)
    return res.json({ success: true, token, user });
  } catch (e) {
    console.error('login user oauth callback e ', e)
    return res.json({ error: e.message })
  }
};
