import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Market Drip. All rights reserved.</p>
                <p className={styles.disclaimer}>
                    Disclaimer: The content on this site is for informational purposes only and does not constitute financial advice.
                </p>
            </div>
        </footer>
    );
}
