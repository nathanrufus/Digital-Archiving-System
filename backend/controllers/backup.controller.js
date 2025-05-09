const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const multer = require('multer');
const Backup = require('../models/Backup');
const Document = require('../models/Document');

const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// POST /backup
const createBackup = async (req, res) => {
  const timestamp = Date.now();
  const archiveName = `backup-${timestamp}.zip`;
  const archivePath = path.join(backupDir, archiveName);

  const backup = new Backup({ user: req.user.id, path: archivePath });
  await backup.save();

  try {
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      backup.status = 'completed';
      await backup.save();
      res.download(archivePath); // or return success message with file info
    });

    archive.on('error', async (err) => {
      backup.status = 'failed';
      backup.errorMessage = err.message;
      await backup.save();
      res.status(500).json({ message: 'Backup failed', error: err.message });
    });

    archive.pipe(output);

    // Add metadata
    const documents = await Document.find();
    archive.append(JSON.stringify(documents, null, 2), { name: 'metadata.json' });

    // Add uploaded files
    documents.forEach((doc) => {
      if (fs.existsSync(doc.path)) {
        archive.file(doc.path, { name: `uploads/${path.basename(doc.path)}` });
      }
    });

    await archive.finalize();
  } catch (err) {
    backup.status = 'failed';
    backup.errorMessage = err.message;
    await backup.save();
    res.status(500).json({ message: 'Unexpected error', error: err.message });
  }
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
    const unzipper = require('unzipper');

    // Extract backup
    const directory = await unzipper.Open.file(zipPath);
    const extractPath = path.join(__dirname, '../restored/');
    if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath);

    await directory.extract({ path: extractPath, concurrency: 5 });

    // Read metadata
    const metaPath = path.join(extractPath, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

    // Restore metadata
    await Document.deleteMany({});
    await Document.insertMany(metadata);

    // Copy files
    for (const doc of metadata) {
      const fileName = path.basename(doc.path);
      const restoredFile = path.join(extractPath, 'uploads', fileName);
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

module.exports = { createBackup, restoreBackup, upload };
