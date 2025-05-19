const Folder = require('../models/Folder');
const Document = require('../models/Document');

// POST /folders
const createFolder = async (req, res) => {
  try {
    const { name, category } = req.body;

    const folder = await Folder.create({
      name,
      category,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Folder created', folder });
  } catch (err) {
    res.status(500).json({ message: 'Error creating folder' });
  }
};

// GET /folders
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching folders' });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folderName = req.params.name;

    // Ensure only the user's folders can be deleted
    const folder = await Folder.findOneAndDelete({
      name: folderName,
      createdBy: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or not yours' });
    }

    // Optional: Reassign documents from this folder to 'Untitled' or mark them deleted
    await Document.updateMany(
      { folder: folderName, uploadedBy: req.user.id },
      { $set: { folder: 'Untitled' } }
    );

    res.json({ message: `Folder '${folderName}' deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting folder' });
  }
};


// PATCH /folders/:id
const updateFolder = async (req, res) => {
  try {
    const { name, category } = req.body;
    const folder = await Folder.findById(req.params.id);

    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    if (name) folder.name = name;
    if (category) folder.category = category;

    await folder.save();
    res.json({ message: 'Folder updated', folder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating folder' });
  }
};

// GET /folders/:id/documents
const getDocumentsInFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findById(folderId);

    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    const documents = await Document.find({
      folder: folder.name,
      uploadedBy: req.user.id
    });

    res.json({ folder: folder.name, documents });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching folder contents' });
  }
};

module.exports = {
  createFolder,
  getFolders,
  updateFolder,
  getDocumentsInFolder,
  deleteFolder,
};
