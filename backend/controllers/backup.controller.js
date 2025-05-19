const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const multer = require('multer');
const unzipper = require('unzipper');
const Backup = require('../models/Backup');
const Document = require('../models/Document');

const backupDir = path.join(__dirname, '../backups');
const extractDir = path.join(__dirname, '../restored');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir);

let cancelBackup = false;

// POST /backup
const createBackup = async (req, res) => {
  const timestamp = Date.now();
  const archiveName = `backup-${timestamp}.zip`;
  const archivePath = path.join(backupDir, archiveName);

  const backup = new Backup({ user: req.user.id, path: archivePath });
  await backup.save();

  try {
    cancelBackup = false;
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      if (!cancelBackup) {
        backup.status = 'completed';
        await backup.save();
        res.download(archivePath);
      }
    });

    archive.on('error', async (err) => {
      backup.status = 'failed';
      backup.errorMessage = err.message;
      await backup.save();
      res.status(500).json({ message: 'Backup failed', error: err.message });
    });

    archive.pipe(output);

    const documents = await Document.find();
    archive.append(JSON.stringify(documents, null, 2), { name: 'metadata.json' });

    for (const doc of documents) {
      if (cancelBackup) {
        archive.abort();
        backup.status = 'cancelled';
        await backup.save();
        return res.status(400).json({ message: 'Backup cancelled by user.' });
      }
      if (fs.existsSync(doc.path)) {
        archive.file(doc.path, { name: `uploads/${path.basename(doc.path)}` });
      }
    }

    await archive.finalize();
  } catch (err) {
    backup.status = 'failed';
    backup.errorMessage = err.message;
    await backup.save();
    res.status(500).json({ message: 'Unexpected error', error: err.message });
  }
};

// POST /backup/cancel
const cancelBackupRequest = (req, res) => {
  cancelBackup = true;
  res.json({ message: 'Backup cancel requested.' });
};

// Multer config for restore upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'backups/'),
  filename: (req, file, cb) => cb(null, `restore-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST /restore
const restoreBackup = async (req, res) => {
  const zipPath = req.file.path;

  try {
    const directory = await unzipper.Open.file(zipPath);
    await directory.extract({ path: extractDir, concurrency: 5 });

    const metaPath = path.join(extractDir, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

    await Document.deleteMany({});
    await Document.insertMany(metadata);

    for (const doc of metadata) {
      const fileName = path.basename(doc.path);
      const restoredFile = path.join(extractDir, 'uploads', fileName);
      const targetPath = path.join(__dirname, '../uploads', fileName);
      if (fs.existsSync(restoredFile)) {
        fs.copyFileSync(restoredFile, targetPath);
      }
    }

    res.json({ message: 'Restore completed successfully' });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ message: 'Restore failed', error: err.message });
  }
};

// GET /backup/info
const getBackupInfo = async (req, res) => {
  try {
    const lastBackup = await Backup.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    const documents = await Document.find();

    const folders = [...new Set(documents.map(d => d.folder || 'Untitled'))];
    const categories = [...new Set(documents.flatMap(d => d.tags || []))];

    res.json({
      lastBackupTime: lastBackup?.createdAt?.toISOString() || null,
      folders,
      categories
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch backup info', error: err.message });
  }
};

// GET /restore/info
const getRestoreInfo = async (req, res) => {
  try {
    const lastRestoreZip = fs.readdirSync(backupDir)
      .filter(name => name.startsWith('restore-'))
      .map(name => ({ name, time: fs.statSync(path.join(backupDir, name)).ctime }))
      .sort((a, b) => b.time - a.time)[0];

    const documents = await Document.find();
    const folders = [...new Set(documents.map(d => d.folder || 'Untitled'))];
    const categories = [...new Set(documents.flatMap(d => d.tags || []))];

    res.json({
      lastRestoreTime: lastRestoreZip?.time?.toISOString() || null,
      folders,
      categories
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restore info', error: err.message });
  }
};

// GET /backup/logs
const getBackupLogs = async (req, res) => {
  try {
    const logs = await Backup.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch backup logs', error: err.message });
  }
};

// PATCH /folders/:oldName
const renameFolder = async (req, res) => {
  try {
    const { newName } = req.body;
    await Document.updateMany({ folder: req.params.oldName }, { folder: newName });
    res.json({ message: 'Folder renamed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename folder', error: err.message });
  }
};

// DELETE /folders/:name
const deleteFolder = async (req, res) => {
  try {
    await Document.updateMany({ folder: req.params.name }, { folder: 'Archived' });
    res.json({ message: 'Folder reassigned to Archived' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete folder', error: err.message });
  }
};

// PATCH /categories/:oldTag
const renameCategory = async (req, res) => {
  try {
    const { newTag } = req.body;
    await Document.updateMany(
      { tags: req.params.oldTag },
      { $set: { tags: [newTag] } }
    );
    res.json({ message: 'Category renamed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename category', error: err.message });
  }
};

// DELETE /categories/:tag
const deleteCategory = async (req, res) => {
  try {
    await Document.updateMany(
      { tags: req.params.tag },
      { $pull: { tags: req.params.tag } }
    );
    res.json({ message: 'Category removed from documents' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};

module.exports = {
  createBackup,
  restoreBackup,
  cancelBackupRequest,
  getBackupInfo,
  getRestoreInfo,
  getBackupLogs,
  renameFolder,
  deleteFolder,
  renameCategory,
  deleteCategory,
  upload
};
