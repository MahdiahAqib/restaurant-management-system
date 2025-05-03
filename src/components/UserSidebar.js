import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/UserSidebar.module.css";
import { 
  FiHome, 
  FiMenu, 
  FiShoppingBag, 
  FiClock,
  FiSettings 
} from "react-icons/fi";

export default function UserSidebar() {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link
                href="/home"
                className={`${styles.navLink} ${
                  router.pathname === "/home" ? styles.active : ""
                }`}
              >
                <FiHome className={styles.navIcon} />
                <span className={styles.navText}>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className={`${styles.navLink} ${
                  router.pathname === "/menu" ? styles.active : ""
                }`}
              >
                <FiMenu className={styles.navIcon} />
                <span className={styles.navText}>Menu</span>
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`${styles.navLink} ${
                  router.pathname === "/orders" ? styles.active : ""
                }`}
              >
                <FiShoppingBag className={styles.navIcon} />
                <span className={styles.navText}>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/reservations"
                className={`${styles.navLink} ${
                  router.pathname === "/reservations" ? styles.active : ""
                }`}
              >
                <FiClock className={styles.navIcon} />
                <span className={styles.navText}>Reservations</span>
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={`${styles.navLink} ${
                  router.pathname === "/settings" ? styles.active : ""
                }`}
              >
                <FiSettings className={styles.navIcon} />
                <span className={styles.navText}>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}