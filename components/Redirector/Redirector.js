'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirector({ targetPath }) {
    const router = useRouter();

    useEffect(() => {
        const browserLang = navigator.language;
        let targetLang = 'en';

        if (browserLang.startsWith('ko')) {
            targetLang = 'ko';
        } else if (browserLang.startsWith('ja')) {
            targetLang = 'ja';
        }

        router.replace(`/${targetLang}${targetPath}`);
    }, [router, targetPath]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
            <p>Redirecting...</p>
        </div>
    );
}
