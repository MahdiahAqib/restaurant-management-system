import { useRouter } from "next/router";
import styles from "../styles/UserHeader.module.css";

export default function UserHeader() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login"); // Redirects to pages/login.js
  };

  return (
    <div className={styles.header}>
      <div className={styles.rightSection}>
        <button onClick={handleLoginClick} className={styles.signInBtn}>
          Log In
        </button>
      </div>
    </div>
  );
}
