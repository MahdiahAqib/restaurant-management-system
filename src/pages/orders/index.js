import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserLayout from "../../components/UserLayout";
import styles from "../../styles/UserOrders.module.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = JSON.parse(userCookie).id;
        const response = await fetch(`/api/orders/user/${userId}`);
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className={styles.loading}>Loading orders...</div>
      </UserLayout>
    );
  }

  if (!isLoggedIn) {
    return (
      <UserLayout>
        <div className={styles.error}>
          User not logged in. Please <a href="/login">log in</a> to view orders.
        </div>
      </UserLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <UserLayout>
        <div className={styles.noOrders}>You have no orders yet.</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className={styles.userOrdersPage}>
        <h1 className={styles.pageTitle}>Your Orders</h1>

        <div className={styles.orderList}>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isExpanded={expandedOrder === order._id}
              onToggleExpand={toggleExpandOrder}
            />
          ))}
        </div>
      </div>
    </UserLayout>
  );
}

function OrderCard({ order, isExpanded, onToggleExpand }) {
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
            Rs {order.totalAmount.toFixed(2)}
          </span>
          <span
            className={styles.orderStatus}
            style={{ backgroundColor: statusColors[order.status] }}
          >
            {order.status}
          </span>
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
                      Rs {item.price.toFixed(2)}
                    </span>
                    <span className={styles.orderItemQuantity}>
                      × {item.quantity}
                    </span>
                    <span className={styles.orderItemSubtotal}>
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderFooter}>
            <div className={styles.orderTotal}>
              <span>Total:</span>
              <span>Rs {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
