import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Usermenu.module.css";
import Cookies from "js-cookie";

const UserMenuPage = ({
  menuItems,
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    payment: "cash",
  });

  // Load user data from cookies
  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      const userCookie = Cookies.get("user");

      if (!userCookie) {
        console.log("No user cookie found - redirecting to login");
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userCookie);
        if (!parsedUser?.id) {
          throw new Error("Invalid user data");
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user cookie:", e);
        Cookies.remove("user");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showNotification(`${item.name} added to cart`, "success");
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    showNotification("Item removed from cart", "success");
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.id) {
      showNotification("Please login to complete your order", "error");
      router.push("/login");
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: cart.map((item) => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: calculateTotal(),
        status: "pending",
        address: formData.address,
        phone: formData.phone,
        paymentMethod: formData.payment,
        inHouse: false,
      };

      const response = await fetch(`/api/orders/user/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order failed");
      }

      showNotification("Order placed successfully!", "success");
      setCart([]);
      setIsCheckout(false);
      setFormData({
        address: "",
        phone: "",
        payment: "cash",
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      showNotification(error.message || "Failed to place order", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelect = (method) => {
    setFormData((prev) => ({ ...prev, payment: method }));
  };

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading menu...</div>;
  }

  return (
    <div className={styles.menuPage}>
      {notification && (
        <div
          className={`${styles.notification} ${
            notification.type === "success"
              ? styles.notificationSuccess
              : styles.notificationError
          }`}
        >
          {notification.message}
          <button
            className={styles.notificationClose}
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.categories}>
        <h2 className={styles.categoryTitle}>Categories</h2>
        {categories.map((category) => (
          <div
            key={category}
            className={`${styles.categoryItem} ${
              activeCategory === category ? styles.categoryItemActive : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className={styles.menuItems}>
        {filteredItems.map((item) => (
          <div key={item._id} className={styles.menuItem}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
            )}
            <div className={styles.itemContent}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemDescription}>{item.description}</p>
              <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
              <button
                className={styles.addToCart}
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartCheckoutPanel}>
        <div className={styles.panelContainer}>
          {!isCheckout ? (
            <>
              <h2 className={styles.cartTitle}>Your Cart</h2>
              {cart.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty</p>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item) => (
                      <div key={item._id} className={styles.cartItem}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.cartItemImage}
                          />
                        )}
                        <div className={styles.cartItemDetails}>
                          <div className={styles.cartItemName}>{item.name}</div>
                          <div className={styles.cartItemPrice}>
                            ${item.price.toFixed(2)} × {item.quantity} = $
                            {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <div className={styles.cartItemControls}>
                          <button
                            className={styles.quantityButton}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className={styles.quantityDisplay}>
                            {item.quantity}
                          </span>
                          <button
                            className={styles.quantityButton}
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                          <button
                            className={styles.removeItem}
                            onClick={() => removeFromCart(item._id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.cartTotal}>
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button
                    className={styles.checkoutButton}
                    onClick={() => setIsCheckout(true)}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className={styles.checkoutTitle}>Checkout</h2>
              <form onSubmit={handleCheckout} className={styles.checkoutForm}>
                <div className={styles.checkoutFormFields}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <div className={styles.userInfoDisplay}>
                      {user?.name || "Not available"}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <div className={styles.userInfoDisplay}>
                      {user?.email || "Not available"}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Delivery Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                      placeholder="Street address"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                      placeholder="Contact phone number"
                      pattern="[0-9]{10,15}"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Payment Method*</label>
                    <div className={styles.paymentOptions}>
                      <div
                        className={`${styles.paymentOption} ${
                          formData.payment === "cash"
                            ? styles.paymentOptionSelected
                            : ""
                        }`}
                        onClick={() => handlePaymentSelect("cash")}
                      >
                        Cash on Delivery
                      </div>
                      <div
                        className={`${styles.paymentOption} ${
                          formData.payment === "card"
                            ? styles.paymentOptionSelected
                            : ""
                        }`}
                        onClick={() => handlePaymentSelect("card")}
                      >
                        Credit/Debit Card
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.checkoutActions}>
                  <button
                    type="submit"
                    className={styles.placeOrderButton}
                    disabled={cart.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Processing...
                      </>
                    ) : (
                      `Place Order ($${calculateTotal().toFixed(2)})`
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => setIsCheckout(false)}
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenuPage;
