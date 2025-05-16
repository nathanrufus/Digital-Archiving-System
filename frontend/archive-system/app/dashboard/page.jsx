"use client";

import UploadDropzone from '@/components/UploadDropzone';
import ActivityGraph from '@/components/ActivityGraph';
import SummaryCard from '@/components/SummaryCard';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50">
        <TopBar />

        <main className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Digital Archiving System
          </h1>

          {/* Search and icons are handled inside TopBar */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <UploadDropzone />
            <ActivityGraph />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <SummaryCard
              title="Uploaded Documents"
              subtitle="Last Upload: 16 hours ago"
              icon="📁"
            />
            <SummaryCard
              title="Folder Management"
              subtitle="Last Manage: 22 hours ago"
              icon="🗂"
            />
            <SummaryCard
              title="Retrieve Documents"
              subtitle="Last Download: 1 hour ago"
              icon="📥"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
