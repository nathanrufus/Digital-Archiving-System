"use client";

import { FiUpload, FiEdit2, FiShare2, FiEye, FiDownload } from 'react-icons/fi';
import Image from 'next/image';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <input
        type="text"
        placeholder="Search Documents"
        className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm"
      />

      <div className="flex items-center gap-4 text-gray-600">
        <FiUpload className="cursor-pointer hover:text-violet-600" />
        <FiEdit2 className="cursor-pointer hover:text-violet-600" />
        <FiShare2 className="cursor-pointer hover:text-violet-600" />
        <FiEye className="cursor-pointer hover:text-violet-600" />
        <FiDownload className="cursor-pointer hover:text-violet-600" />

        <div className="ml-6 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Omar Hassan Osman</span>
          <Image
            src="/avatar.jpg"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}