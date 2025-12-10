export const dynamic = 'force-static';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: 'https://your-domain.com/sitemap.xml',
    }
}
