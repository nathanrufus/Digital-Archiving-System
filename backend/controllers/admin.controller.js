const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

module.exports = { getAllUsers, updateUserRole };
