import Link from 'next/link'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Admin</h2>
      <nav>
        <ul className={styles.navList}>
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li><Link href="/admin/reservations">Reservations</Link></li>
          <li><Link href="/admin/orders">Orders</Link></li>
          <li><Link href="/admin/staff">Staff</Link></li>
          <li><Link href="/admin/menu">Menu</Link></li>
          <li><Link href="/admin/customers">Customers</Link></li>
          <li><Link href="/admin/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  )
}
