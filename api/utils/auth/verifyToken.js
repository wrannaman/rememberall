import jwt from 'jsonwebtoken';
import { pg } from '../../connections/index.js'; // Import your Sequelize models

const createUser = async (decoded) => {
  const { User, Org } = pg.models
  let [user, created] = await User.findOrCreate({
    where: { email: decoded.email },
    defaults: {
      name: decoded?.user_metadata?.full_name || 'Unknown',
      email: decoded.email
    },
    include: [Org]
  });
  let org = user?.OrgId ? await Org.findOne({ where: { id: user?.OrgId } }) : null;
  if (created) {
    if (!org) {
      org = await Org.create({ name: 'Default' });
    }
    user.OrgId = org.id;
    await user.save();
    try {
      await axios.post('https://hooks.slack.com/services/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', {
        text: `email validation api new user - ${user.email}`
      })
    } catch (e) { }
  }
  user = user.toJSON();
  user.Org = org;
  return user;
}

let apikeyCache = {};

setInterval(() => {
  apikeyCache = {};
}, 1000 * 60);

export const verifyToken = async (req, res, next) => {
  const { User, Org } = pg.models

  const authHeader = req?.headers?.authorization?.replace('Bearer ', '');

  try {
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    if (!decoded?.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let user = await User.findOne({ where: { email: decoded.email }, include: [Org] });
    if (!user) {
      user = await createUser(decoded);
    }
    req.user = user;
    return next();
  } catch (error) {
    try {
      // Check if it's an API key
      if (apikeyCache[authHeader]) {
        req.user = apikeyCache[authHeader];
        return next();
      }

      const user = await User.findOne({ where: { apikey: authHeader }, include: [Org] });
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      apikeyCache[authHeader] = user;
      req.user = user;
      return next();
    } catch (error) {
      console.error("Token verification error and API key not found:", error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};
