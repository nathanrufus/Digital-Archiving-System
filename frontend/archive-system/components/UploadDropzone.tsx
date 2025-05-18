"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFolder } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UploadDropzone() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFiles([file]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!');
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Try again.');
    }
  }, []);

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
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl bg-white h-full cursor-pointer hover:bg-gray-50 transition"
    >
      <input {...getInputProps()} />
      <FiFolder size={48} className="text-violet-600 mb-4" />
      <p className="text-gray-600 font-medium">
        {isDragActive ? "Drop the file here..." : "Drag and drop, or click to select a file"}
      </p>
      {files.length > 0 && (
        <p className="text-sm text-green-600 mt-2">Selected: {files[0].name}</p>
      )}
    </div>
  );
}
