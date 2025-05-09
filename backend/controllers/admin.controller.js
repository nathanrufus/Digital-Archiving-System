const User = require('../models/User');

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'general'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

module.exports = { updateUserRole };
