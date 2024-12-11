
import { pg } from '../../connections/index.js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OAuth2 = google.auth.OAuth2;
let google_oauth = fs.readFileSync(path.join(__dirname, '../../google_oauth.json'), 'utf8');
google_oauth = JSON.parse(google_oauth)
const redirectIndex = process.env.ENV === 'production' ? 1 : 0

export default async (req, res) => {
  console.log('okk');

  const { Org } = pg.models
  try {
    const { provider } = req.params
    let loginLink = null
    const oauth2Client = new OAuth2(google_oauth.web.client_id, google_oauth.web.client_secret, google_oauth.web.redirect_uris[redirectIndex]);
    loginLink = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
      prompt: 'consent',
      scope: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ]
    });
    console.log("loginLink:", loginLink)
    return res.json({ success: true, link: loginLink });
  } catch (e) {
    console.error('oauth link e ', e)
    return res.json({ error: e.message })
  }
};
