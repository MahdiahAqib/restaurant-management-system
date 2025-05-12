import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import EditStaffModal from "../../../components/EditStaffModal";
import styles from "../../../styles/Staff.module.css";
import AddStaffModal from "../../../components/AddStaffModal";
import { requireAdminAuth } from "../../../lib/auth";

export const getServerSideProps = requireAdminAuth();

const StaffPage = (session) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  // Success message
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff");
        if (!response.ok) throw new Error("Failed to fetch staff");
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
    setStaffToDelete({ id: staffId, name: staffName });
    setShowDeleteModal(true);
  };

  const handleAddStaff = async (newStaff) => {
    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStaff),
      });

      if (!response.ok) throw new Error("Failed to add staff");

      const addedStaff = await response.json();
      setStaff([...staff, addedStaff]);
      setSuccessMessage(`${addedStaff.name} added successfully!`);
      setShowAddModal(false);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/staff/${staffToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete staff");

      setStaff(staff.filter((member) => member.staff_id !== staffToDelete.id));
      setSuccessMessage(`${staffToDelete.name} deleted successfully!`);
      setShowDeleteModal(false);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (staffMember) => {
    setCurrentStaff(staffMember);
    setShowEditModal(true);
  };

  const handleSaveChanges = async (updatedStaff) => {
    try {
      const response = await fetch(`/api/staff/${updatedStaff.staff_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salary: updatedStaff.salary,
          timings: updatedStaff.timings,
        }),
      });

      if (!response.ok) throw new Error("Failed to update staff");

      setStaff(
        staff.map((member) =>
          member.staff_id === updatedStaff.staff_id ? updatedStaff : member
        )
      );
      setSuccessMessage(`${updatedStaff.name}'s details updated successfully!`);
      setShowEditModal(false);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading staff data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <>
      <Head>
        <title>Staff | Restaurant Admin</title>
      </Head>

      <div className={styles.header}>
        <h1>Staff Members</h1>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          + Add Staff
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
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
                <td>{member.staff_id}</td>
                <td>{member.name}</td>
                <td className={styles.emailCell}>{member.email}</td>
                <td>{member.age}</td>
                <td>
                  <span className={styles.role}>{member.role}</span>
                </td>
                <td className={styles.salary}>
                  Rs. {member.salary.toLocaleString()}
                </td>
                <td className={styles.timings}>{member.timings}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleEditClick(member)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() =>
                        handleDeleteClick(member.staff_id, member.name)
                      }
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={staffToDelete?.name || "this staff member"}
        itemType="staff member"
      />

      <EditStaffModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        staffMember={currentStaff}
        onSave={handleSaveChanges}
      />

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddStaff}
      />
    </>
  );
};

StaffPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default StaffPage;
