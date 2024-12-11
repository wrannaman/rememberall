import { pg } from '../../connections/index.js';
import { v4 as uuidv4 } from 'uuid';
export default async (req, res) => {
  const { email } = req?.user || {};

  if (!email) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    const { User } = pg.models;

    // Find the user by email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate and set a new API key
    user.apikey = uuidv4();
    console.log("new user.apikey:", user.apikey)
    await user.save();

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user API key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
