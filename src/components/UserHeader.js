import { useState, useEffect } from "react";
import { FaUserCircle, FaUtensils, FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "../styles/UserHeader.module.css";
import Link from "next/link";
import NotificationPanel from "./NotificationPanel";

export default function UserHeader({ preLogin = false }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Don't check for user if this is pre-login header
    if (preLogin) return;

    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, preLogin]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setDropdownVisible(false);
    router.push("/");
  };

  const handleEditProfile = () => {
    setDropdownVisible(false);
    router.push("/user/edit-profile");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoText}>FAST</span>
          <span className={styles.logoHighlight}>Food</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/menu" className={styles.navLink}>
          <FaUtensils className={styles.navIcon} />
          <span>Menu</span>
        </Link>
        <Link href="/reservations" className={styles.navLink}>
          <FaCalendarAlt className={styles.navIcon} />
          <span>Reserve Table</span>
        </Link>
      </nav>

      <div className={styles.userSection}>
        {!preLogin && <NotificationPanel />}
        {preLogin ? (
          <button onClick={handleLoginClick} className={styles.loginButton}>
            <FaUserCircle className={styles.loginIcon} />
            <span>Sign In</span>
          </button>
        ) : user ? (
          <div className={styles.userMenu} onClick={toggleDropdown}>
            <div className={styles.userAvatar}>
              <FaUserCircle className={styles.avatarIcon} />
            </div>
            <span className={styles.userName}>{user.name}</span>
            <IoIosArrowDown
              className={`${styles.dropdownArrow} ${dropdownVisible ? styles.arrowOpen : ''}`}
            />
            {dropdownVisible && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={handleEditProfile}>
                  My Profile
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLoginClick} className={styles.loginButton}>
            <FaUserCircle className={styles.loginIcon} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}