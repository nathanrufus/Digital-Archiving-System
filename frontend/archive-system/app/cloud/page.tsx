"use client";

import { FiHardDrive, FiImage, FiMail, FiUploadCloud, FiRotateCw } from "react-icons/fi";
import Link from "next/link";
export default function CloudPage() {
  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Documents"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Storage Overview & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Storage Breakdown */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Storage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-4 rounded-xl shadow-md">
              <FiHardDrive size={28} className="mb-2" />
              <p className="text-lg font-semibold">Applications</p>
              <p className="text-sm text-white/80">42 GB used</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white p-4 rounded-xl shadow-md">
              <FiImage size={28} className="mb-2" />
              <p className="text-lg font-semibold">Photos</p>
              <p className="text-sm text-white/80">19 GB used</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-4 rounded-xl shadow-md">
              <FiMail size={28} className="mb-2" />
              <p className="text-lg font-semibold">Mail</p>
              <p className="text-sm text-white/80">32 GB used</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ width: "73%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">93 GB of 128 GB Used</p>
          </div>
        </div>

        {/* Backup and Restore */}
        <div className="flex flex-col gap-4">
          <div className="bg-purple-600 text-white rounded-xl p-6 flex flex-col items-center justify-center shadow-md cursor-pointer hover:bg-purple-700 transition">
            <FiUploadCloud size={36} className="mb-2" />
            <p className="text-lg font-semibold">Backup</p>
          </div>
          <div className="bg-blue-500 text-white rounded-xl p-6 flex flex-col items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition">
            <FiRotateCw size={36} className="mb-2" />
            <p className="text-lg font-semibold">Restore</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Link href="/documents">
    <div className="bg-white border rounded-xl p-4 shadow flex flex-col cursor-pointer hover:bg-gray-50 transition">
      <div className="text-yellow-500 text-4xl mb-2">📁</div>
      <p className="text-lg font-semibold">Uploaded Documents</p>
      <p className="text-sm text-gray-500 mt-1">Last Upload: 16 hours ago</p>
    </div>
  </Link>

  <Link href="/folders">
    <div className="bg-white border rounded-xl p-4 shadow flex flex-col cursor-pointer hover:bg-gray-50 transition">
      <div className="text-yellow-500 text-4xl mb-2">📁</div>
      <p className="text-lg font-semibold">Folder Management</p>
      <p className="text-sm text-gray-500 mt-1">Last Manage: 22 hours ago</p>
    </div>
  </Link>

  <Link href="/retrieve">
    <div className="bg-white border rounded-xl p-4 shadow flex flex-col cursor-pointer hover:bg-gray-50 transition">
      <div className="text-yellow-500 text-4xl mb-2">📁</div>
      <p className="text-lg font-semibold">Retrieve Documents</p>
      <p className="text-sm text-gray-500 mt-1">Last Download: 1 hour ago</p>
    </div>
  </Link>
</div>

    </div>
  )
}
