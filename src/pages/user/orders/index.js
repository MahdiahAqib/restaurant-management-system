import { useEffect, useState } from "react";
import UserLayout from "../../../components/UserLayout";
console.log("UserLayout:", UserLayout);
import styles from "../../../styles/UserOrders.module.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "123";

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
            <OrderCard order={currentOrder} />
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
      <div className={styles.card} style={{ marginTop: "1rem" }}>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              order.status === "completed"
                ? styles.statusCompleted
                : styles.statusPending
            }
          >
            {order.status}
          </span>
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.orderTime).toLocaleString()}
        </p>
        <div>
          {order.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                margin: "0.5rem 0",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                width="60"
                height="60"
                style={{ borderRadius: "5px" }}
              />
              <div>
                <p>{item.name}</p>
                <p>
                  Qty: {item.quantity} | Price: Rs {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p>
          <strong>Total:</strong> Rs {order.totalAmount}
        </p>
      </div>
    );
  }
}
