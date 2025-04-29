import { useEffect, useState } from "react";
import UserLayout from "../../components/UserLayout";
import styles from "../../styles/UserOrders.module.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "661c1234567890abcdef1234";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        const data = await res.json();
        console.log("Fetched Orders:", data);
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error Fetching Orders", error);
        console.log("error hai");
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <UserLayout>
        <p className={styles.loading}>Loading Orders...</p>
      </UserLayout>
    );

  if (orders.length === 0) {
    return (
      <UserLayout>
        <p className={styles.empty}>You have no orders yet.</p>
      </UserLayout>
    );
  }
  const currentOrder = orders.filter((order) => order.status !== "completed");
  const pastOrders = orders.filter((order) => order.status === "completed");

  return (
    <UserLayout>
      <main className={styles.mainContent}>
        <h1 className={styles.accent}>Your Orders</h1>

        {currentOrder && (
          <section className={styles.card}>
            <h2>Current Order</h2>
            {currentOrder.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </section>
        )}

        <section className={styles.card} style={{ marginTop: "2rem" }}>
          <h2>Order History</h2>
          {pastOrders.length > 0 ? (
            pastOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <p>No past orders.</p>
          )}
        </section>
      </main>
    </UserLayout>
  );

  function OrderCard({ order }) {
    return (
      <div
        className={styles.card}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: "10px",
          backgroundColor: "#1e1e1e",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Order Date */}
        <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
          <strong>Date:</strong> {new Date(order.orderTime).toLocaleString()}
        </p>

        {/* Order Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {order.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: "#2a2a2a",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                width="60"
                height="60"
                style={{ borderRadius: "5px", objectFit: "cover" }}
              />
              <div style={{ flex: "1" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#aaa" }}>
                  Qty: {item.quantity} | Price: Rs {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Status + Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          {/* Status */}
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                order.status === "completed"
                  ? styles.statusCompleted
                  : styles.statusPending
              }
              style={{ textTransform: "capitalize" }}
            >
              {order.status}
            </span>
          </p>

          {/* Total */}
          <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            Total: Rs {order.totalAmount}
          </p>
        </div>
      </div>
    );
  }
}
