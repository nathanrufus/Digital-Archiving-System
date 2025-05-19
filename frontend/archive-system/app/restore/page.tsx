"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFolder, FiTrash2 } from "react-icons/fi";

interface RestoreInfo {
  lastRestoreTime: string;
  folders: string[];
  categories: string[];
}

export default function RestorePage() {
  const [info, setInfo] = useState<RestoreInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRestoreInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/backup/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch restore info:", err);
    }
  };

  const handleRestore = async (file: File) => {
    try {
      setIsRestoring(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      await axios.post("/api/restore", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      toast.success("Restore completed!");
      fetchRestoreInfo();
    } catch (err) {
      toast.error("Restore failed");
    } finally {
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    fetchRestoreInfo();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Digital Archiving System</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sky-600 text-3xl">
              <FiUploadCloud />
            </div>
            <div>
              <p className="text-lg font-semibold">Restore</p>
              <p className="text-sm text-gray-500">
                Last Restore: {info?.lastRestoreTime || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRestoring}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            {isRestoring ? "Restoring..." : "Start Restore"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => e.target.files && handleRestore(e.target.files[0])}
          />
        </div>

        {isRestoring && (
          <div className="bg-sky-100 rounded-full h-4 w-full overflow-hidden mb-6">
            <div
              className="bg-sky-600 h-full text-xs text-white text-center"
              style={{ width: `${progress}%` }}
            >
              Restore on progress... {progress}%
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Recently accessed folders</p>
          <div className="grid grid-cols-4 gap-4">
            {info?.folders.map((folder, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-800 hover:text-sky-600 cursor-pointer"
              >
                <FiFolder /> {folder || "Untitled"}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-600 mb-2">By Category</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {info?.categories.map((category, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <FiFolder /> {category}
                </div>
                <FiTrash2 className="text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
