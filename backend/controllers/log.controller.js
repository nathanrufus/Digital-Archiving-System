const Log = require('../models/Log');
const User = require('../models/User');

const getLogs = async (req, res) => {
  try {
    const { user, action } = req.query;
    const query = {};

    if (user) query.user = user;
    if (action) query.action = action;

    const logs = await Log.find(query)
      .populate('user', 'name email')
      .populate('documentId', 'name')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};

module.exports = { getLogs };
