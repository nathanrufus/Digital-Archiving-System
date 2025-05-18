'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [maxFileSizeMB, setMaxFileSizeMB] = useState<number>(0);
  const [allowedTypes, setAllowedTypes] = useState<string>('');
  const [storageUsedMB, setStorageUsedMB] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        const data = res.data;
        setMaxFileSizeMB(data.maxFileSizeMB);
        setAllowedTypes(data.allowedTypes.join(','));
        setStorageUsedMB(data.storageUsedMB);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = {
        maxFileSizeMB,
        allowedTypes: allowedTypes.split(',').map((t) => t.trim()),
      };
      await axios.patch('/api/settings', payload);
      toast.success('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Update failed.');
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Admin Settings</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Max File Size (MB)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={maxFileSizeMB}
          onChange={(e) => setMaxFileSizeMB(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Allowed File Types (comma-separated)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={allowedTypes}
          onChange={(e) => setAllowedTypes(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Storage Used:</strong> {storageUsedMB} MB</p>
      </div>
    </div>
  );
}
