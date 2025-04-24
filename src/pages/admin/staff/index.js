import React from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/AdminLayout'
import styles from '../../../styles/Staff.module.css'

const mockStaff = [
  { id: '#S-001', name: 'Alice Johnson', role: 'Manager', status: 'Active', lastLogin: '2h ago' },
  { id: '#S-002', name: 'Bob Smith', role: 'Chef', status: 'Active', lastLogin: '1d ago' },
  { id: '#S-003', name: 'Carol Lee', role: 'Waiter', status: 'Inactive', lastLogin: '3d ago' },
  // …more rows or fetch from your API
]

function StaffPage() {
  return (
    <>
      <Head>
        <title>Staff | Restaurant Admin</title>
      </Head>
      <div className={styles.header}>
        <h1>Staff Members</h1>
        <button className={styles.addBtn}>+ Add Staff</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockStaff.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td>
                  <span className={s.status === 'Active' ? styles.active : styles.inactive}>
                    {s.status}
                  </span>
                </td>
                <td>{s.lastLogin}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}>•••</button>
                    <ul className={styles.dropdown}>
                      <li>View Profile</li>
                      <li>Edit</li>
                      <li>Deactivate</li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}>Previous</button>
        {[1,2,3,4].map(n => (
          <button key={n} className={`${styles.pageBtn} ${n===1?styles.active:''}`}>{n}</button>
        ))}
        <button className={styles.pageBtn}>Next</button>
      </div>
    </>
  )
}

StaffPage.getLayout = page => <AdminLayout>{page}</AdminLayout>
export default StaffPage
