import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND);
    const { email } = req.query
    if (!email) {
      return res.json({ success: false, message: 'No email provided' })
    }
    // if email is invalid using regex 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: 'Invalid email' })
    }

    // Create JWT token with user email and expiration
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    const magicLink = `${process.env.APP}/oauth/magic?token=${token}`;
    console.log("magicLink:", magicLink)
    if (process.env.NODE_ENV === 'production') {
      const ok = await resend.emails.send({
        from: 'welcome@auth.xo.capital',
        to: email,
        subject: 'Secret Agent - Your Login Link',
        html: `Click <a href="${magicLink}">here</a> to sign in to your account.`
      });
      console.log("ok:", ok)

      res.json({ success: true, message: 'Magic link sent successfully' });
    } else {
      return res.json({ success: true, message: 'Magic link sent successfully', magicLink: magicLink })
    }
  } catch (error) {
    console.error('Error sending magic link:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
}