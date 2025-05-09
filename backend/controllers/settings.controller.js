const Settings = require('../models/Settings');
const Document = require('../models/Document');
const fs = require('fs');

const updateSettings = async (req, res) => {
  try {
    const { allowedFileTypes, maxFileSizeMB } = req.body;
    let settings = await Settings.findOne();

    if (!settings) settings = new Settings();
    if (allowedFileTypes) settings.allowedFileTypes = allowedFileTypes;
    if (maxFileSizeMB) settings.maxFileSizeMB = maxFileSizeMB;

    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get settings' });
  }
};

const getSystemStatus = async (req, res) => {
  try {
    const documents = await Document.find();
    let totalSize = 0;

    documents.forEach(doc => {
      if (fs.existsSync(doc.path)) {
        const stats = fs.statSync(doc.path);
        totalSize += stats.size;
      }
    });

    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    const totalDocs = documents.length;

    res.json({
      storageUsedMB: usedMB,
      totalDocuments: totalDocs,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get system status' });
  }
};

module.exports = {
  updateSettings,
  getSettings,
  getSystemStatus,
};
