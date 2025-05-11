import React, { useState } from "react";
import styles from "../styles/EditStaffModal.module.css";

export default function EditStaffModal({
  isOpen,
  onClose,
  staffMember,
  onSave,
}) {
  const [formData, setFormData] = useState({
    salary: staffMember?.salary || "",
    timings: staffMember?.timings || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...staffMember,
      ...formData,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Staff Member</h3>
        <p>
          Editing: <strong>{staffMember?.name}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Salary (Rs.)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Working Timings</label>
            <input
              type="text"
              name="timings"
              value={formData.timings}
              onChange={handleChange}
              placeholder="e.g., 9 AM - 5 PM"
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
