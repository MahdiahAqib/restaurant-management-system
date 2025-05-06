import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../components/AdminLayout";
import styles from "../../../styles/AdminOrders.module.css";

export default function AdminOrders() {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders/admin");
      setCurrentOrders(response.data.currentOrders);
      setOrderHistory(response.data.orderHistory);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch("/api/orders/admin", {
        orderId,
        status: newStatus,
      });
      const updatedOrder = response.data;

      if (newStatus === "completed") {
        setCurrentOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
        setOrderHistory((prev) => [updatedOrder, ...prev]);
      } else {
        setCurrentOrders((prev) =>
          prev.map((order) => (order._id === orderId ? updatedOrder : order))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className={styles.loading}>Loading orders...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <AdminLayout>
      <div className={styles.adminOrdersPage}>
        <h1 className={styles.pageTitle}>RestroAdmin</h1>

        <div className={styles.sectionsContainer}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Current Orders</h2>
            {currentOrders.length === 0 ? (
              <p className={styles.noOrders}>No current orders</p>
            ) : (
              <div className={styles.orderList}>
                {currentOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    isExpanded={expandedOrder === order._id}
                    onToggleExpand={toggleExpandOrder}
                  />
                ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order History</h2>
            {orderHistory.length === 0 ? (
              <p className={styles.noOrders}>No order history</p>
            ) : (
              <div className={styles.orderList}>
                {orderHistory.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    isExpanded={expandedOrder === order._id}
                    onToggleExpand={toggleExpandOrder}
                    readonly
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function OrderCard({
  order,
  onStatusChange,
  isExpanded,
  onToggleExpand,
  readonly = false,
}) {
  const statusColors = {
    pending: "#FFC107",
    preparing: "#FF9800",
    ready: "#2196F3",
    "out for delivery": "#9C27B0",
    completed: "#4CAF50",
  };

  const formattedDate = new Date(order.orderTime).toLocaleString();

  return (
    <div className={styles.orderCard}>
      <div
        className={styles.orderHeader}
        onClick={() => onToggleExpand(order._id)}
      >
        <div className={styles.orderMeta}>
          <span className={styles.orderId}>
            Order #{order._id.slice(-6).toUpperCase()}
          </span>
          <span className={styles.orderDate}>{formattedDate}</span>
        </div>
        <div className={styles.orderSummary}>
          <span className={styles.tableNo}>
            {order.inHouse ? `Table ${order.tableNo || "N/A"}` : "Delivery"}
          </span>
          <span className={styles.totalAmount}>
            ${order.totalAmount.toFixed(2)}
          </span>
          {readonly ? (
            <span
              className={styles.orderStatus}
              style={{ backgroundColor: statusColors[order.status] }}
            >
              {order.status}
            </span>
          ) : (
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order._id, e.target.value)}
              className={styles.statusDropdown}
              style={{ backgroundColor: statusColors[order.status] }}
            >
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
        </div>
        <button className={styles.expandButton}>
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.orderDetails}>
          <div className={styles.orderItems}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <img
                  src={item.image || "/placeholder-food.jpg"}
                  alt={item.name}
                  className={styles.orderItemImage}
                />
                <div className={styles.orderItemDetails}>
                  <h3 className={styles.orderItemName}>{item.name}</h3>
                  <div className={styles.orderItemMeta}>
                    <span className={styles.orderItemPrice}>
                      ${item.price.toFixed(2)}
                    </span>
                    <span className={styles.orderItemQuantity}>
                      × {item.quantity}
                    </span>
                    <span className={styles.orderItemSubtotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderFooter}>
            <div className={styles.customerInfo}>
              <span>Customer ID: {order.userId?.slice(-6) || "N/A"}</span>
            </div>
            <div className={styles.orderTotal}>
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
