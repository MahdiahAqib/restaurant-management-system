import Link from 'next/link'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>RestroAdmin</h2>
      <nav>
        <ul className={styles.navList}>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/reservations">Reservations</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li><Link href="/staff">Staff</Link></li>
          <li><Link href="/analytics">Analytics</Link></li>
          <li><Link href="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  )
}
