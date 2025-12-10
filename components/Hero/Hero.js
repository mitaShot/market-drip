import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    const categories = [
        { name: 'Stocks', path: '/tag/stocks' },
        { name: 'Dividends', path: '/tag/dividends' },
        { name: 'Retirement', path: '/tag/retirement' },
        { name: 'Banking', path: '/tag/banking' },
        { name: 'Crypto', path: '/tag/crypto' },
    ];

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                <h1 className={styles.title}>Investing</h1>
                <p className={styles.subtitle}>
                    Smart investing is about patience and perspective. We help you make decisions with your money that you can feel good about.
                </p>
                <div className={styles.chips}>
                    {categories.map((cat) => (
                        <Link key={cat.name} href={cat.path} className={styles.chip}>
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
