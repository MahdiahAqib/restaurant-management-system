import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import styles from "../styles/UserLayout.module.css";

console.log("UserSidebar:", UserSidebar);
console.log("UserHeader:", UserHeader);

export default function UserLayout({ children }) {
  return (
    <div className={styles.layout}>
      <UserSidebar />
      <div className={styles.contentWrapper}>
        <UserHeader />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
