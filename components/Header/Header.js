import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    Market<span style={{ color: 'var(--color-primary-dark)' }}>Drip</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/category/stocks" className={styles.link}>Stocks</Link>
                    <Link href="/category/retirement" className={styles.link}>Retirement</Link>
                    <Link href="/category/banking" className={styles.link}>Banking</Link>
                    <Link href="/category/credit-cards" className={styles.link}>Credit Cards</Link>
                </nav>
                <div className={styles.actions}>
                    <button className={styles.loginBtn}>Sign In</button>
                </div>
            </div>
        </header>
    );
}
