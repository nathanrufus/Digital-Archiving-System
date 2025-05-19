"use client";

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFolder } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UploadDropzone() {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [folder, setFolder] = useState<string>('Untitled');
  const [device, setDevice] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('/api/folders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFolders(res.data.map((f: any) => f.name));
      } catch (err) {
        console.error("Failed to load folders", err);
      }
    };
    fetchFolders();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setFiles([acceptedFiles[0]]);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return toast.error("No file selected");
     if (!device) return toast.error("Please select a device");

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('folder', folder || 'Untitled');
    formData.append('device', device);
    formData.append('tags', tags);
    formData.append('description', description);

    try {
      const token = localStorage.getItem("token");
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      toast.success('File uploaded successfully!');
      setFiles([]);
      setFolder('Untitled');
      setDevice('');
      setTags('');
      setDescription('');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Try again.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
    },
  });

  return (
    <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-8 rounded-xl bg-white w-full max-w-xl mx-auto">
      <div {...getRootProps()} className="w-full text-center cursor-pointer hover:bg-gray-50 py-6">
        <input {...getInputProps()} />
        <FiFolder size={48} className="text-violet-600 mb-2 mx-auto" />
        <p className="text-gray-600 font-medium">
          {isDragActive ? "Drop the file here..." : "Drag and drop, or click to select a file"}
        </p>
        {files.length > 0 && (
          <p className="text-sm text-green-600 mt-2">Selected: {files[0].name}</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6 w-full space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Folder</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Untitled">Untitled</option>
              {folders.map((f, idx) => (
                <option key={idx} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Device</label>
            <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a device</option>
                <option value='mobile'>Mobile</option>
                <option value='tablet'>Tablet</option>
                <option value='desktop'>Desktop</option>
              </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., finance, confidential"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <button
              onClick={handleUpload}
              disabled={!device}
              className={`w-full mt-2 px-4 py-2 rounded transition text-white ${
                !device ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              Upload File
            </button>

        </div>
      )}
    </div>
  );
}
