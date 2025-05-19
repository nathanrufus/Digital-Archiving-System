"use client";

import UploadDropzone from '@/components/UploadDropzone';
import ActivityGraph from '@/components/ActivityGraph';
import SummaryCard from '@/components/SummaryCard';
import Link from "next/link";


export default function DashboardPage() {
  return (
    <>
       <input
        type="text"
        placeholder="Search Documents"
        className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <UploadDropzone />
        <ActivityGraph />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Link href="/documents">
          <div>
            <SummaryCard
              title="Uploaded Documents"
              subtitle="Last Upload: 16 hours ago"
              icon="📁"
            />
          </div>
        </Link>

        <Link href="/folders">
          <div>
            <SummaryCard
              title="Folder Management"
              subtitle="Last Manage: 22 hours ago"
              icon="🗂"
            />
          </div>
        </Link>

        <Link href="/retrieve">
          <div>
            <SummaryCard
              title="Retrieve Documents"
              subtitle="Last Download: 1 hour ago"
              icon="📥"
            />
          </div>
        </Link>
      </div>

    </>
  );
}
