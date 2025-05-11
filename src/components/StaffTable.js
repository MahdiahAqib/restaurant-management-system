// src/components/StaffTable.js
import styles from "../styles/Staff.module.css";

export default function StaffTable({ staff, onDeleteClick }) {
  return (
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
                  <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                    Edit
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => onDeleteClick(member._id, member.name)}
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
  );
}
