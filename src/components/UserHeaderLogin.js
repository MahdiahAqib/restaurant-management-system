import React from 'react';
import Link from 'next/link';
import userHeaderStyles from '../styles/UserHeaderLogin.module.css'; // Renamed import to avoid conflict
import globalHeaderStyles from "../styles/UserHeader.module.css"; // Renamed import to avoid conflict
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className={globalHeaderStyles.header}> {/* Use globalHeaderStyles for main header styles */}
      <button className={userHeaderStyles.backButton} onClick={() => router.push("/")}>
        ← Back
      </button>

      <div className={globalHeaderStyles.logo}> {}
        <Link href="/">
          <span className={globalHeaderStyles.logoText}>FAST</span>
          <span className={globalHeaderStyles.logoHighlight}>Food</span>
        </Link>
      </div>
    </header>
  );
}
