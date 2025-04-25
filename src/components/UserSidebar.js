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
              href="/user/home"
              className={router.pathname === "/user/home" ? styles.active : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/user/menu"
              className={router.pathname === "/user/menu" ? styles.active : ""}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/user/orders"
              className={
                router.pathname === "/user/orders" ? styles.active : ""
              }
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link
              href="/user/reservations"
              className={
                router.pathname === "/user/reservations" ? styles.active : ""
              }
            >
              Reservations
            </Link>
          </li>
          <li>
            <Link
              href="/user/settings"
              className={
                router.pathname === "/user/settings" ? styles.active : ""
              }
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
