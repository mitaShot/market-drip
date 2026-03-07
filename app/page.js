import RootRedirector from '@/components/Redirector/RootRedirector';

export const metadata = {
  alternates: {
    canonical: 'https://market-drip.com/en',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootPage() {
  return (
    <>
      {/* Fallback for non-JS environments (Googlebot): go to /en */}
      <meta httpEquiv="refresh" content="0; url=/en" />
      <link rel="canonical" href="https://market-drip.com/en" />
      <style>{`body{background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif}`}</style>
      {/* JS users get language-aware redirect */}
      <RootRedirector />
      <p>Redirecting… <a href="/en">/en</a></p>
    </>
  );
}
