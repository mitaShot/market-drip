'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootRedirector() {
    const router = useRouter();

    useEffect(() => {
        const browserLang = navigator.language || navigator.userLanguage || '';
        let targetLang = 'en';

        if (browserLang.startsWith('ko')) {
            targetLang = 'ko';
        } else if (browserLang.startsWith('ja')) {
            targetLang = 'ja';
        }

        router.replace(`/${targetLang}`);
    }, [router]);

    return null;
}
