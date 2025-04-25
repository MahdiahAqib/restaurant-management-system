<<<<<<< HEAD
// components/AdminLayout.js
import Sidebar from './AdminSidebar'
import Header from './AdminHeader'
import styles from '../styles/AdminLayout.module.css'
=======
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "../styles/AdminLayout.module.css";
>>>>>>> 0d94a1b86ecbe8ce43c91fde935875daa56cae68

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
