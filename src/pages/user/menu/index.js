import { useState, useEffect } from 'react';
import styles from '../../../styles/Usermenu.module.css';
const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [cart, setCart] = useState([]);
    const [isCheckout, setIsCheckout] = useState(false);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        payment: 'cash'
    });

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menu');
                const data = await response.json();
                setMenuItems(data);
                const uniqueCategories = [...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
                if (uniqueCategories.length > 0) {
                    setActiveCategory(uniqueCategories[0]);
                }
            } catch (error) {
                showNotification('Failed to load menu', 'error');
            }
        };
        fetchMenuItems();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => 
                cartItem._id === item._id  // Compare by _id instead of id
            );
    
            if (existingItemIndex !== -1) {
                // Item already in cart → increment quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1
                };
                return updatedCart;
            } else {
                // New item → add to cart with quantity 1
                return [
                    ...prevCart,
                    {
                        ...item,
                        quantity: 1
                    }
                ];
            }
        });
    
        showNotification(`${item.name} added to cart`, 'success');
    };
    
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    
    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
        showNotification('Item removed from cart', 'success');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        showNotification('Order placed successfully!', 'success');
        setCart([]);
        setIsCheckout(false);
        setFormData({
            name: '',
            email: '',
            address: '',
            payment: 'cash'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSelect = (method) => {
        setFormData(prev => ({ ...prev, payment: method }));
    };

    const filteredItems = menuItems.filter(item => item.category === activeCategory);

    return (
        <div className={styles.menuPage}>
            {/* Notification */}
            {notification && (
                <div className={`${styles.notification} ${
                    notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
                }`}>
                    {notification.message}
                    <button 
                        className={styles.notificationClose} 
                        onClick={() => setNotification(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Categories */}
            <div className={styles.categories}>
                <h2 className={styles.categoryTitle}>Categories</h2>
                {categories.map(category => (
                    <div
                        key={category}
                        className={`${styles.categoryItem} ${
                            activeCategory === category ? styles.categoryItemActive : ''
                        }`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </div>
                ))}
            </div>

            {/* Menu Items */}
            <div className={styles.menuItems}>
                {filteredItems.map(item => (
                    <div key={item.id} className={styles.menuItem}>
                        {item.image && (
                            <img src={item.image} alt={item.name} className={styles.itemImage} />
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

            {/* Cart & Checkout Panel */}
            <div className={styles.cartCheckoutPanel}>
                <div className={styles.panelContainer}>
                    {!isCheckout ? (
                        <>
                            <h2 className={styles.cartTitle}>Your Cart</h2>
                            {cart.length === 0 ? (
                                <p>Your cart is empty</p>
                            ) : (
                                <>
                                    <div className={styles.cartItems}>
                                        {cart.map(item => (
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
                                                        ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className={styles.cartItemControls}>
                                                    <button 
                                                        className={styles.quantityButton}
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.quantityDisplay}>{item.quantity}</span>
                                                    <button 
                                                        className={styles.quantityButton}
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Payment Method</label>
                                    <div className={styles.paymentOptions}>
                                        <div 
                                            className={`${styles.paymentOption} ${
                                                formData.payment === 'cash' ? styles.paymentOptionSelected : ''
                                            }`}
                                            onClick={() => handlePaymentSelect('cash')}
                                        >
                                            Cash
                                        </div>
                                        <div 
                                            className={`${styles.paymentOption} ${
                                                formData.payment === 'card' ? styles.paymentOptionSelected : ''
                                            }`}
                                            onClick={() => handlePaymentSelect('card')}
                                        >
                                            Card
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit"
                                    className={styles.placeOrderButton}
                                    disabled={cart.length === 0}
                                >
                                    Place Order
                                </button>
                                <button 
                                    type="button"
                                    className={styles.backButton}
                                    onClick={() => setIsCheckout(false)}
                                >
                                    Back to Cart
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;