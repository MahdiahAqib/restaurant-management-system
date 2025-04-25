import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Staff.module.css';

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [staffNameToDelete, setStaffNameToDelete] = useState(null); // New state for staff name
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

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

  const handleDeleteClick = (staffId, staffName) => {
    setStaffToDelete(staffId);
    setStaffNameToDelete(staffName); // Set the name of the staff member
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/staff/${staffToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }

      // Update the staff list after successful deletion
      setStaff(staff.filter(member => member.staff_id !== staffToDelete));
      setSuccessMessage('Staff member deleted successfully!'); // Set success message
      setShowDeleteModal(false);

      // Optionally clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (staffId) => {
    // Logic for editing staff member profile
    console.log(`Edit staff profile with ID: ${staffId}`);
  };

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
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Timings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>#{member.staff_id}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.age}</td>
                    <td>{member.role}</td>
                    <td>{member.salary}</td>
                    <td>{member.timings}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEdit(member.staff_id)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteClick(member.staff_id, member.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete staff member "{staffNameToDelete}"? This action cannot be undone.</p>
                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmDeleteBtn}
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>
              {successMessage}
            </div>
          )}

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
