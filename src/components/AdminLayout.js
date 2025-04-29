// components/AdminLayout.js
import Sidebar from "./AdminSidebar";
import Header from "./AdminHeader";
import styles from "../styles/AdminLayout.module.css";

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header userName="John" />
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}
