import React, { useState } from "react";
import styles from "../styles/AddStaffModal.module.css";

export default function AddStaffModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    role: "Waiter",
    salary: "",
    timings: "9 AM - 5 PM",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    if (!formData.timings) newErrors.timings = "Timings are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        age: Number(formData.age),
        salary: Number(formData.salary),
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Staff Member</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Full Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ""}
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ""}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Phone*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.errorInput : ""}
            />
            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Age*</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="70"
                className={errors.age ? styles.errorInput : ""}
              />
              {errors.age && (
                <span className={styles.errorText}>{errors.age}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Waiter">Waiter</option>
                <option value="Chef">Chef</option>
                <option value="Manager">Manager</option>
                <option value="Cleaner">Cleaner</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Salary (Rs.)*</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={errors.salary ? styles.errorInput : ""}
              />
              {errors.salary && (
                <span className={styles.errorText}>{errors.salary}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Working Timings*</label>
              <input
                type="text"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                className={errors.timings ? styles.errorInput : ""}
              />
              {errors.timings && (
                <span className={styles.errorText}>{errors.timings}</span>
              )}
            </div>
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
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
