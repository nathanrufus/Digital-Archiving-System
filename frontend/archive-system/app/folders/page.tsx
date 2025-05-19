"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiFolder, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

interface Folder {
  name: string;
  category?: string;
}

interface Category {
  name: string;
}

export default function FolderPage() {
  const [recentFolders, setRecentFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/folders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const folders = res.data;
        setRecentFolders(folders.slice(0, 6));

        const uniqueCategories: Category[] = Array.from(
          new Set<string>(folders.map((folder: Folder) => folder.category || ""))
        ).map((name) => ({ name }));

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching folders", err);
        toast.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (categoryName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the folder '${categoryName}'?\nAll documents will be moved to 'Untitled'.`
    );
  
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/folders/${categoryName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCategories((prev) => prev.filter((c) => c.name !== categoryName));
      toast.success(`Folder '${categoryName}' deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete folder");
    }
  };
  

  const handleCreateFolder = async () => {
    if (!folderName) return toast.error("Folder name is required");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/folders", {
        name: folderName,
        category,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Folder created");
      setShowModal(false);
      setFolderName("");
      setCategory("");
      setRecentFolders((prev) => [res.data.folder, ...prev]);
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Documents"
          className="w-full max-w-md p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => setShowModal(true)}
          className="ml-4 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          <FiPlus /> New Folder
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-yellow-500 text-3xl">📁</div>
            <div>
              <p className="text-lg font-semibold">Folder Management</p>
              <p className="text-sm text-gray-500">Last Manage: 22 hours ago</p>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-2">Recently accessed folders</p>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recentFolders.map((folder, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-800">
                  <div className="w-4 h-4 bg-black rounded-sm" />
                  {folder.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-[200px]">
          <p className="text-sm font-medium text-gray-700 mb-2">By Category</p>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((cat, idx) => (
                <li key={idx} className="flex items-center justify-between text-gray-800 text-sm">
                  <span className="flex items-center gap-2">
                    <FiFolder className="text-gray-500" />
                    {cat.name}
                  </span>
                  <FiTrash2
                    className="text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(cat.name)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
