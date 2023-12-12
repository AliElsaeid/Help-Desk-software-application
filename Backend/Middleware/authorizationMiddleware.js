const User = require('../Models/UserModel');

const authorize = (roles) => {
  return async (req, res, next) => {
    try {
      // Fetch user based on userId in req.user
      const user = await User.findById(req.userId);

      if (!user || !roles.some(role => user.role === role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = authorize;
