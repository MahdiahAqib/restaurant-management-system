import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from "../styles/UserHeader.module.css";

export default function UserHeader() {
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn = () => {
    // You can hook this into your auth system
    console.log("Sign In Clicked");
    setSignedIn(true);
  };

  return (
    <div className={styles.header}>
      <div className={styles.rightSection}>
        {signedIn ? (
          <div className={styles.userGreeting}>
            <FaUserCircle className={styles.icon} />
            <span>Welcome back!</span>
          </div>
        ) : (
          <button onClick={handleSignIn} className={styles.signInBtn}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
