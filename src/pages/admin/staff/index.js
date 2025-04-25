import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Staff.module.css';

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff');
        if (!response.ok) {
          throw new Error('Failed to fetch staff data');
        }
        const data = await response.json();
        setStaff(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <>
      <Head>
        <title>Staff | Restaurant Admin</title>
      </Head>
      <div className={styles.header}>
        <h1>Staff Members</h1>
        <button className={styles.addBtn}>+ Add Staff</button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading staff data...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
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
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>#{member.staff_id}</td>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      <span className={member.status === 'Active' ? styles.active : styles.inactive}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      {member.last_login 
                        ? new Date(member.last_login).toLocaleString() 
                        : 'Never'}
                    </td>
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
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                className={`${styles.pageBtn} ${n === 1 ? styles.active : ''}`}
              >
                {n}
              </button>
            ))}
            <button className={styles.pageBtn}>Next</button>
          </div>
        </>
      )}
    </>
  );
}

StaffPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default StaffPage;