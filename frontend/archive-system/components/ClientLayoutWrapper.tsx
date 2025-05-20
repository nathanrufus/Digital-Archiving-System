"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Loader from './Loader';
import { useLoading } from '@/context/LoadingContext';
import { AuthContext } from '@/context/AuthContext';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading } = useLoading();
  const { isAuthenticated } = useContext(AuthContext);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

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
