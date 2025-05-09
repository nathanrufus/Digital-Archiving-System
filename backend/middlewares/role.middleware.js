const allowRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role access' });
      }
      next();
    };
  };
  
  module.exports = allowRoles;
  