
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiFolder, FiUpload, FiPlay, FiTrash2 } from "react-icons/fi";

interface BackupInfo {
  lastBackupTime: string;
  folders: string[];
  categories: string[];
}

export default function BackupRestorePage() {
  const [info, setInfo] = useState<BackupInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const fetchBackupInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/backup/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch backup info:", err);
    }
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setProgress(0);
      const token = localStorage.getItem("token");

      const res = await axios.post("/api/backup", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Backup completed!");
      fetchBackupInfo();
    } catch (err) {
      toast.error("Backup failed");
    } finally {
      setIsBackingUp(false);
    }
  };

  useEffect(() => {
    fetchBackupInfo();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Digital Archiving System</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-purple-600 text-3xl">
              <FiUpload />
            </div>
            <div>
              <p className="text-lg font-semibold">Backup</p>
              <p className="text-sm text-gray-500">
                Last Backup: {info?.lastBackupTime || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={loading || isBackingUp}
            className={`px-4 py-2 rounded-lg text-white transition ${isBackingUp ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {isBackingUp ? (
            <button
                onClick={async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.post("/api/backup/cancel", {}, {
                    headers: { Authorization: `Bearer ${token}` },
                    });
                    toast.success("Backup cancelled.");
                    setIsBackingUp(false);
                } catch (err) {
                    toast.error("Failed to cancel backup.");
                }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
                Stop Backup
            </button>
            ) : (
            <button
                onClick={handleBackup}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
            >
                Start Backup
            </button>
            )}

          </button>
        </div>

        {isBackingUp && (
          <div className="bg-purple-100 rounded-full h-4 w-full overflow-hidden mb-6">
            <div
              className="bg-purple-600 h-full text-xs text-white text-center"
              style={{ width: `${progress}%` }}
            >
              Backup in progress... {progress}%
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Recently accessed folders</p>
          <div className="grid grid-cols-4 gap-4">
            {info?.folders.map((folder, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-800 hover:text-purple-600 cursor-pointer"
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
