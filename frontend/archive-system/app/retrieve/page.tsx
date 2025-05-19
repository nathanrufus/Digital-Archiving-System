"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiDownload,
  FiInfo,
  FiEdit,
  FiTrash
} from "react-icons/fi";
import toast from "react-hot-toast";

interface DocumentItem {
  name: string;
  size: number;
  status: string;
  devices: string[];
  tags: string[];
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const tagColor = (tag: string) => {
  switch (tag) {
    case "media": return "bg-orange-100 text-orange-600";
    case "document": return "bg-blue-100 text-blue-600";
    case "illustration": return "bg-purple-100 text-purple-600";
    case "mail": return "bg-green-100 text-green-600";
    case "audio": return "bg-indigo-100 text-indigo-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function RetrieveDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("/api/documents");
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to load documents:", err);
        toast.error("Failed to load documents.");
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = (fileName: string) => {
    // Replace with real download logic
    toast.success(`Download triggered for ${fileName}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Digital Archiving System</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Documents"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-yellow-500 text-3xl">📁</div>
          <div>
            <p className="text-lg font-semibold">Retrieve Documents</p>
            <p className="text-sm text-gray-500">Last Manage: 22 hours ago</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Devices</th>
                <th className="py-2 pr-4">Tags</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-2 pr-4 text-gray-800">{doc.name}</td>
                  <td className="py-2 pr-4 text-gray-600">{formatBytes(doc.size)}</td>
                  <td className="py-2 pr-4">
                    {doc.status === "done" ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiAlertCircle className="text-yellow-500" />
                    )}
                  </td>
                  <td className="py-2 pr-4 flex gap-1">
                    {doc.devices.includes("mobile") && <FiSmartphone className="text-gray-500" />}
                    {doc.devices.includes("tablet") && <FiTablet className="text-gray-500" />}
                    {doc.devices.includes("desktop") && <FiMonitor className="text-gray-500" />}
                  </td>
                  <td className="py-2 pr-4 flex gap-2 flex-wrap">
                    {doc.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${tagColor(tag)}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </td>
                  <td className="py-2 pr-4 flex gap-3 text-purple-600">
                    <FiDownload
                      className="cursor-pointer hover:text-purple-800"
                      onClick={() => handleDownload(doc.name)}
                    />
                    <FiInfo className="cursor-pointer hover:text-purple-800" />
                    <FiEdit className="cursor-pointer hover:text-purple-800" />
                    <FiTrash className="cursor-pointer hover:text-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
