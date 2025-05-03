import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import styles from "../styles/UserLayout.module.css";

export default function UserLayout({ children }) {
  return (
    <div className={styles.layout}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <UserHeader />
      </header>

      {/* Fixed Sidebar below header */}
      <aside className={styles.sidebar}>
        <UserSidebar />
      </aside>

      {/* Scrollable Content Area */}
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}