import { pg } from '../../connections/index.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { User, Org } = pg.models;

  try {
    // Assuming `req.user.email` is available
    const user = await User.findOne({
      where: { email: req?.user?.email },
      include: [Org]
    });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    // create new jwt token 
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Token expires in 30 days
    );
    // if there is a Org?.openai_api_key, redact it
    if (user.Org?.openai_api_key) {
      user.Org.openai_api_key = '********'
    }

    return res.json({ success: true, user, token });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
