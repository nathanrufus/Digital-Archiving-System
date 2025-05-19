"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Loader from './Loader';
import { useLoading } from '@/context/LoadingContext';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const { loading } = useLoading();

  return (
    <>
      <Loader show={loading} />
      {isAuthPage ? (
        children
      ) : (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="p-6 overflow-y-auto">{children}</main>
          </div>
        </div>
      )}
    </>
  );
}
