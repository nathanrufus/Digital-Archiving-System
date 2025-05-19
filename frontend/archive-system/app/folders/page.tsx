"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiFolder, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface Folder {
  name: string;
}

interface Category {
  name: string;
}

export default function FolderPage() {
  const [recentFolders, setRecentFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch folders and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, categoryRes] = await Promise.all([
          axios.get("/api/folders/recent"),
          axios.get("/api/folders/categories"),
        ]);
        setRecentFolders(recentRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Error fetching folders or categories", err);
        toast.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category delete
  const handleDelete = async (categoryName: string) => {
    try {
      await axios.delete(`/api/folders/categories/${categoryName}`);
      setCategories((prev) => prev.filter((c) => c.name !== categoryName));
      toast.success(`Category '${categoryName}' deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Digital Archiving System</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Documents"
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Folder Management Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row gap-6 justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-yellow-500 text-3xl">📁</div>
            <div>
              <p className="text-lg font-semibold">Folder Management</p>
              <p className="text-sm text-gray-500">Last Manage: 22 hours ago</p>
            </div>
          </div>

          {/* Recently Accessed */}
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

        {/* Right Section - By Category */}
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
    </div>
  );
}
