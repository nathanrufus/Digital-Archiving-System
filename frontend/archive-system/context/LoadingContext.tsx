"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

const LoadingContext = createContext<{ loading: boolean }>({ loading: false });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    setLoading(false);
    delayTimer = setTimeout(() => {
      setLoading(true);
    }, 300); // Show only after 300ms

    hideTimer = setTimeout(() => {
      clearTimeout(delayTimer);
      setLoading(false);
    }, 1200); // Ensure it disappears smoothly

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
