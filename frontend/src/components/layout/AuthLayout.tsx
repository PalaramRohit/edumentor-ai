
import React from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={`${styles.orb} ${styles.orb1}`} />
                <div className={`${styles.orb} ${styles.orb2}`} />
                <div className={`${styles.orb} ${styles.orb3}`} />
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
