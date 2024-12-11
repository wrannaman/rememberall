import { pg } from '../../connections/index.js'
import axios from 'axios'
import qs from 'qs'
import { TwitterApi } from 'twitter-api-v2'
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

export default async function handleOauthCallback(req, res) {
  const { User, Project, Platform } = pg.models
  const { provider } = req.params
  const { code, state } = req.query
  if (!code || !state) return res.json({ error: 'no_code_or_state' })
  // state is PlatformId 
  const platform = await Platform.findOne({ where: { id: state } })
  if (provider === 'linkedin') {
    const url = "https://www.linkedin.com/oauth/v2/accessToken"
    const params = {
      grant_type: 'authorization_code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      code,
      redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    try {
      const { data } = await axios.post(url, qs.stringify(params), { headers })
      // update the platform with the access token 
      const newMeta = { ...platform.meta, ...data }
      await platform.update({ meta: { ...newMeta } })
      // TODO: Store the access token and handle user data
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`)
    } catch (error) {
      console.error("LinkedIn OAuth error:", error?.response?.data)
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=linkedin_oauth_failed`)
    }
  }
  if (provider === 'twitter') {
    try {
      const { code } = req.query;
      const { codeVerifier } = platform.meta; // We stored this during auth initiation

      const twitterClient = new TwitterApi({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET
      });

      const { accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: process.env.TWITTER_CALLBACK_URL
      });

      // Update platform with new tokens
      const newMeta = {
        ...platform.meta,
        accessToken,
        refreshToken,
        lastTokenRefresh: new Date().toISOString()
      };

      await platform.update({ meta: newMeta });
      if (accessToken && refreshToken) {
        console.log('✅ Twitter OAuth success')
      }
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`);
    } catch (error) {
      console.error("Twitter OAuth error:", error);
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=twitter_oauth_failed`);
    }
  }
  if (provider === 'google') {
    try {
      const { code } = req.query;

      // Create OAuth client using platform's stored credentials
      const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
      );

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      if (!tokens?.refresh_token) {
        return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=no_refresh_token`);
      }

      // Set credentials and get user info
      oauth2Client.setCredentials({ access_token: tokens.access_token });
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      });

      const { data: userInfo } = await oauth2.userinfo.get();

      // Update platform with tokens and user info
      const newMeta = {
        ...platform.meta,
        ...tokens,
        lastTokenRefresh: new Date().toISOString()
      };

      await platform.update({ meta: newMeta });

      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=google_oauth_failed`);
    }
  }
  if (provider === 'tiktok') {
    try {
      const url = 'https://open.tiktokapis.com/v2/oauth/token/';
      const params = {
        client_key: process.env.TIKTOK_CLIENT_ID,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_CALLBACK_URL,
      };

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const { data } = await axios.post(url, qs.stringify(params), { headers });
      console.log("tiktok data:", data)

      // Update platform with tokens
      const newMeta = {
        ...platform.meta,
        ...data,
        lastTokenRefresh: new Date().toISOString()
      };

      await platform.update({ meta: newMeta });

      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`);
    } catch (error) {
      console.error("TikTok OAuth error:", error?.response?.data);
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=tiktok_oauth_failed`);
    }
  }
  if (provider === 'reddit') {
    try {
      const url = 'https://www.reddit.com/api/v1/access_token';
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDDIT_CALLBACK_URL
      });

      const { data } = await axios.post(url, params, {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Update platform with tokens
      const newMeta = {
        ...platform.meta,
        ...data,
        lastTokenRefresh: new Date().toISOString()
      };
      console.log("newMeta:", newMeta)
      await platform.update({ meta: newMeta });

      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`);
    } catch (error) {
      console.error("Reddit OAuth error:", error?.response?.data);
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=reddit_oauth_failed`);
    }
  }
  if (provider === 'threads') {
    try {
      const tokenUrl = 'https://graph.threads.net/oauth/access_token';
      const params = new URLSearchParams({
        client_id: process.env.THREADS_APP_ID,
        client_secret: process.env.THREADS_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.THREADS_CALLBACK_URL,
        code: code
      });

      // Get short-lived token
      const { data } = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Exchange for long-lived token
      const longLivedTokenUrl = 'https://graph.threads.net/access_token';
      const longLivedParams = new URLSearchParams({
        grant_type: 'th_exchange_token',
        client_secret: process.env.THREADS_APP_SECRET,
        access_token: data.access_token
      });

      const longLivedResponse = await axios.get(`${longLivedTokenUrl}?${longLivedParams}`);

      // Calculate token expiration date
      const expiresIn = longLivedResponse.data.expires_in || 5183944; // 60 days in seconds
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

      // Update platform with tokens and user info
      const newMeta = {
        ...platform.meta,
        ...longLivedResponse.data,
        user_id: data.user_id,
        lastTokenRefresh: new Date().toISOString(),
        tokenExpirationDate: expirationDate.toISOString()
      };

      // const response = await axios.get('https://graph.threads.net/v1.0/me', {
      //   params: {
      //     fields: 'id,username,threads_profile_picture_url,threads_biography',
      //     access_token: newMeta.access_token
      //   }
      // });
      // console.log("response:", response)
      // console.log("longLivedResponse.data.access_token:", newMeta.access_token)

      await platform.update({ meta: { ...newMeta } });

      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?success=true`);
    } catch (error) {
      console.error("Threads OAuth error:", error?.response?.data || error.message);
      return res.redirect(`${process.env.APP}/project/${platform.ProjectId}?error=threads_oauth_failed`);
    }
  }
}
