"use client";

import { FiFolder } from 'react-icons/fi';

export default function UploadDropzone() {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl bg-white h-full">
      <FiFolder size={48} className="text-violet-600 mb-4" />
      <p className="text-gray-600 font-medium">Drop your files here, or browse</p>
    </div>
  );
}
