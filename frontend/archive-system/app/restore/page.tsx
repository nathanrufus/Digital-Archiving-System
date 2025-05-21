"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFolder, FiTrash2, FiRefreshCw } from "react-icons/fi";

interface RestoreInfo {
  lastRestoreTime: string;
  folders: string[];
  categories: string[];
}

interface RestoreStatus {
  status: 'idle' | 'in_progress';
  startedAt?: string;
  pid?: number;
}

export default function RestorePage() {
  const [info, setInfo] = useState<RestoreInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<RestoreStatus>({ status: 'idle' });

  useEffect(() => {
    fetchRestoreInfo();
    checkRestoreStatus();
    
    const interval = setInterval(checkRestoreStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRestoreInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/backup/restore/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch restore info:", err);
    }
  };

  const checkRestoreStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/backup/restore/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestoreStatus(res.data);
      
      if (isRestoring && res.data.status === 'idle') {
        setIsRestoring(false);
        fetchRestoreInfo();
        toast.success("Restore completed successfully!");
      }
    } catch (err) {
      console.error("Failed to check restore status:", err);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  };

  const handleRestore = async (file?: File) => {
    if (restoreStatus.status === 'in_progress') {
      toast.error("A restore operation is already in progress");
      return;
    }

    try {
      setIsRestoring(true);
      setProgress(0);
      const token = localStorage.getItem("token");
      const source = axios.CancelToken.source();

      const timeout = setTimeout(() => {
        source.cancel('Request timeout');
        toast.error('Restore is taking longer than expected. Please wait...');
      }, 300000); // 5 minutes

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("/api/backup/restore", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          cancelToken: source.token,
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        });
      } else {
        await axios.post("/api/backup/restore/latest", {}, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });
      }

      clearTimeout(timeout);
      toast.success("Restore completed successfully!");
      fetchRestoreInfo();
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.error("Restore was cancelled due to timeout");
      } else {
        toast.error(`Restore failed: ${getErrorMessage(err)}`);
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const onRestoreClick = () => {
    handleRestore(); 
  };

  return (
    <div className="p-6">
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
              {restoreStatus.status === 'in_progress' && (
                <p className="text-sm text-amber-600">
                  Restore in progress since: {new Date(restoreStatus.startedAt || '').toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onRestoreClick}
            disabled={isRestoring || restoreStatus.status === 'in_progress'}
            className={`px-4 py-2 rounded-lg transition ${
              isRestoring || restoreStatus.status === 'in_progress'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            {restoreStatus.status === 'in_progress' ? (
              <span className="flex items-center gap-2">
                <FiRefreshCw className="animate-spin" /> Restoring...
              </span>
            ) : isRestoring ? (
              "Preparing restore..."
            ) : (
              "Start Restore"
            )}
          </button>
        </div>

        {(isRestoring || restoreStatus.status === 'in_progress') && (
          <div className="bg-sky-100 rounded-full h-4 w-full overflow-hidden mb-6">
            <div
              className="bg-sky-600 h-full text-xs text-white text-center"
              style={{ width: `${progress}%` }}
            >
              Restore in progress... {progress}%
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