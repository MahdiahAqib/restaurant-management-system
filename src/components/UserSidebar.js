import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/UserSidebar.module.css";

export default function UserSidebar() {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>🍽️ Restro</h2>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link
              href="/"
              className={router.pathname === "/" ? styles.active : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/menu"
              className={router.pathname === "/menu" ? styles.active : ""}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/orders"
              className={router.pathname === "/orders" ? styles.active : ""}
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link
              href="/reservations"
              className={
                router.pathname === "/reservations" ? styles.active : ""
              }
            >
              Reservations
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={router.pathname === "/settings" ? styles.active : ""}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
