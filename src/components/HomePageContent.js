// components/HomePageContent.js
import { useState, useEffect } from 'react';
import styles from '../styles/UserHomepage.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function HomePageContent({ showHeader = true, requireLogin = false }) {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch featured items');
        }
        const data = await response.json();
        setFeaturedItems(data.slice(0, 6));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const handleOrderClick = (e) => {
    if (requireLogin) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.loadingPlate}></div>
          <div className={styles.loadingUtensil}></div>
        </div>
        <p className={styles.loadingText}>Preparing your culinary journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Something went wrong</h3>
        <p className={styles.errorMessage}>Error loading featured items: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.loginModal}>
            <h3 className={styles.modalTitle}>Login Required</h3>
            <p className={styles.modalMessage}>Please login to continue.</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.modalLoginButton}
                onClick={handleLoginRedirect}
              >
                Go to Login
              </button>
              <button 
                className={styles.modalCancelButton}
                onClick={handleCloseLoginModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroOverlay}></div>
            <video autoPlay muted loop className={styles.heroVideo}>
              <source src="/videos/food-hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Culinary</span>
              <span className={styles.heroTitleLine}>Excellence</span>
              <span className={styles.heroTitleLine}>Redefined</span>
            </h1>
            <p className={styles.heroSubtitle}>Experience the artistry of flavor with our chef's signature creations</p>
            <div className={styles.heroButtons}>
              <Link href="/menu" className={styles.primaryButton}>
                <span>Explore Menu</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/reservations" className={styles.secondaryButton} onClick={handleOrderClick}>
                <span>Reserve Table</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.105 21 21 20.105 21 19V7C21 5.895 20.105 5 19 5H5C3.895 5 3 5.895 3 7V19C3 20.105 3.895 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div style={{ marginBottom: '60px' }}></div>
          </div>
        </section>

        {/* Featured Menu Section */}
        {featuredItems.length > 0 ? (
          <section className={styles.menuSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionSubtitle}>Signature Creations</p>
              <h2 className={styles.sectionTitle}>Chef's Selections</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            
            <div className={styles.menuGrid}>
              {featuredItems.map((item, index) => (
                <div key={item._id} className={styles.menuItem}>
                  <div className={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <div 
                    className={styles.itemImage}
                    style={{ 
                      backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'})`
                    }}
                  />
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <div className={styles.priceDivider}></div>
                      <span className={styles.itemPrice}>${item.price?.toFixed(2) || '0.00'}</span>
                    </div>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemFooter}>
                      <Link 
                        href="/menu" 
                        className={styles.orderButton}
                        onClick={handleOrderClick}
                      >
                        <span>Order Now</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/menu" className={styles.viewAllButton}>
              View Complete Menu
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </section>
        ) : (
          <section className={styles.menuSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionSubtitle}>Coming Soon</p>
              <h2 className={styles.sectionTitle}>New Seasonal Menu</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            <p className={styles.emptyMenuMessage}>Our chef is crafting an exciting new seasonal menu. Check back soon for our latest creations!</p>
            <Link href="/menu" className={styles.viewAllButton}>
              View Current Menu
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </section>
        )}

        {/* About Section */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImageContainer}>
              <div className={styles.aboutImage}></div>
              <div className={styles.aboutImageDecoration}></div>
            </div>
            <div className={styles.aboutContent}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionSubtitle}>Our Heritage</p>
                <h2 className={styles.sectionTitle}>A Legacy of Flavor</h2>
                <div className={styles.sectionDivider}></div>
              </div>
              <p className={styles.aboutText}>
                Founded in 2010, our restaurant has been a cornerstone of culinary innovation, blending traditional techniques with contemporary flair. Each dish tells a story of passion, precision, and the finest locally-sourced ingredients.
              </p>
              <p className={styles.aboutText}>
                Our Michelin-trained chefs bring decades of global experience to your plate, creating not just meals but memorable dining experiences that linger long after the last bite.
              </p>
              <div className={styles.signatureContainer}>
                <div className={styles.signatureLine}></div>
                <p className={styles.signatureText}>Executive Chef Marco Bellini</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionSubtitle}>Ready to experience</p>
              <h2 className={styles.sectionTitle}>Exceptional Dining?</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            <p className={styles.ctaText}>Book your table now or explore our menu for delivery options</p>
            <div className={styles.ctaButtons}>
              <Link 
                href="/menu" 
                className={styles.ctaPrimary}
                onClick={handleOrderClick}
              >
                <span>Order Online</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/reservations" className={styles.ctaSecondary} onClick={handleOrderClick}>
                <span>Reserve Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.105 21 21 20.105 21 19V7C21 5.895 20.105 5 19 5H5C3.895 5 3 5.895 3 7V19C3 20.105 3.895 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}