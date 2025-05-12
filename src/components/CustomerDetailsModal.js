import React from "react";
import styles from "../styles/CustomerDetailsModal.module.css";
import { FiX } from "react-icons/fi";

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
  orders,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FiX />
        </button>

        <h2>Customer Details</h2>

        <div className={styles.customerInfo}>
          <h3>Basic Information</h3>
          <div className={styles.infoGrid}>
            <span className={styles.infoLabel}>Name:</span>
            <span className={styles.infoValue}>
              {customer?.name || "Not available"}
            </span>

            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>
              {customer?.email || "Not available"}
            </span>
          </div>
        </div>

        <div className={styles.ordersSection}>
          <h3>Recent Orders</h3>
          {orders.length > 0 ? (
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Delivery Address</th>
                  <th>Contact Number</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                    <td>{order.address || "Not specified"}</td>
                    <td>{order.phone || "Not provided"}</td>
                    <td>
                      <ul className={styles.itemsList}>
                        {order.items.map((item) => (
                          <li key={item._id}>
                            {item.quantity}x {item.name} (Rs. {item.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>Rs. {order.totalAmount}</td>
                    <td className={styles[order.status]}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders found for this customer.</p>
          )}
        </div>
      </div>
    </div>
  );
}
