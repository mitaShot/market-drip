export const metadata = {
    title: 'Research Team | Market Drip',
    description: 'Market Drip Research Team – delivering data-driven financial insights and stock analysis, daily.',
    alternates: {
        canonical: 'https://market-drip.com/author/team',
    },
};

export default function AuthorTeamPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Market Drip Research Team',
        url: 'https://market-drip.com',
        logo: 'https://market-drip.com/icon.png',
        description: 'A team of financial analysts and data researchers providing daily market analysis, stock breakdowns, and investment insights across US equities, ETFs, and emerging sectors.',
        sameAs: [
            'https://market-drip.com/en',
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
                    Market Drip Research Team
                </h1>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#aaa', marginBottom: '24px' }}>
                    We are a team of financial analysts and data researchers dedicated to delivering
                    clear, data-driven market insights every day. Our coverage spans US equities,
                    ETFs, AI-driven sectors, crypto, and emerging market trends.
                </p>
                <p style={{ color: '#aaa', lineHeight: 1.8 }}>
                    Every article is backed by primary sources — company filings, earnings reports,
                    institutional data, and real-time market signals — so you can make informed
                    decisions with confidence.
                </p>
                <div style={{ marginTop: '48px', borderTop: '1px solid #333', paddingTop: '32px' }}>
                    <a
                        href="/en"
                        style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}
                    >
                        ← Back to Market Drip
                    </a>
                </div>
            </main>
        </>
    );
}
