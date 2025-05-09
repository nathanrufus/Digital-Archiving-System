const Log = require('../models/Log');

const logAction = async ({ user, action, documentId = null, description = '' }) => {
  try {
    await Log.create({
      user,
      action,
      documentId,
      description,
    });
  } catch (err) {
    console.error('Log error:', err.message);
  }
};

module.exports = logAction;
