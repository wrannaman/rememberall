import { pg } from '../../connections/index.js';

export default async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const { Newsletter } = pg.models;

    // Check if the email is already subscribed
    const existingNewsletter = await Newsletter.findOne({
      where: { email: email }
    });

    if (existingNewsletter) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Create a new subscription
    await Newsletter.create({ email: email });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error handling subscription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
