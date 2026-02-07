'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    let targetLang = 'en';

    if (browserLang.startsWith('ko')) {
      targetLang = 'ko';
    } else if (browserLang.startsWith('ja')) {
      targetLang = 'ja';
    }

    router.replace(`/${targetLang}`);
  }, [router]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
          <p>Redirecting...</p>
        </div>
      </body>
    </html>
  );
}
