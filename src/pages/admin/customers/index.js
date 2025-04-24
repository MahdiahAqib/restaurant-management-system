// src/pages/admin/customers/index.js
import React from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Customers.module.css'
import { FiFilter } from 'react-icons/fi'

const mockCustomers = [
  { id: '#C-00456', date: '26 Mar 2020, 12:42 AM', name: 'Veronica', location: '21 King Street London', spent: '$74.92', last: '$21.55' },
  // …add more rows or fetch from API
]

function CustomersPage() {
  return (
    <>
      <Head>
        <title>Customers | Restaurant Admin</title>
      </Head>
      <div className={styles.header}>
        <h1>General Customers</h1>
        <button className={styles.filterBtn}>
          <FiFilter /> Filter
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Join Date</th>
              <th>Customer Name</th>
              <th>Location</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.date}</td>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>{c.spent}</td>
                <td>{c.last}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}>•••</button>
                    <ul className={styles.dropdown}>
                      <li>View Detail</li>
                      <li>Edit</li>
                      <li>Delete</li>
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
          <button key={n} className={`${styles.pageBtn} ${n===3?styles.active:''}`}>{n}</button>
        ))}
        <button className={styles.pageBtn}>Next</button>
      </div>
    </>
  )
}

CustomersPage.getLayout = page => <AdminLayout>{page}</AdminLayout>
export default CustomersPage
