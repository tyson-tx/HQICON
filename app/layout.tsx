'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', 'G-5BTT2H796F', {
          page_path: url,
        });
      }
    };

    handleRouteChange(pathname); // 初始化时记录当前页面视图

    // 监听路由变化
    const handlePopState = () => handleRouteChange(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
