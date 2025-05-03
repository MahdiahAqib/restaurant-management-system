import { useState } from 'react';
import styles from '../styles/Usermenu.module.css';

const GuestMenuPage = ({ 
    menuItems, 
    categories, 
    activeCategory, 
    setActiveCategory 
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddToCart = () => {
        setShowLoginModal(true);
    };

    const filteredItems = menuItems.filter(item => item.category === activeCategory);

    return (
        <div className={styles.menuPage}>
            {/* Login Modal */}
            {showLoginModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.loginModal}>
                        <h3 className={styles.modalTitle}>Login Required</h3>
                        <p className={styles.modalMessage}>Please login to add items to your cart.</p>
                        <div className={styles.modalButtons}>
                            <button 
                                className={styles.modalLoginButton}
                                onClick={() => window.location.href = '/login'}
                            >
                                Go to Login
                            </button>
                            <button 
                                className={styles.modalCancelButton}
                                onClick={() => setShowLoginModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className={`${styles.notification} ${
                    notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
                }`}>
                    {notification.message}
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
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestMenuPage;