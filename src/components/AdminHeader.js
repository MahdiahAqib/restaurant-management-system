import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from '../styles/Header.module.css';

export default function Header() {
  const { data: session } = useSession(); // Get session data from NextAuth
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter(); // Initialize useRouter to handle navigation

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  const handleLogout = () => {
    signOut({
      callbackUrl: '/admin/login', // Redirect to login page after logout
    });
  };

  const handleViewProfile = () => {
    console.log('View Profile clicked');
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerRight}>
        <div className={styles.userMenu} onClick={toggleDropdown}>
          <FaUserCircle className={styles.icon} />
          <span className={styles.greeting}>
            {session ? `Hello, ${session.user.name}` : "Hello, Guest!"} {/* Show user name or fallback to "Guest" */}
          </span>
          <IoIosArrowDown
            className={`${styles.arrow} ${dropdownVisible ? styles.arrowOpen : ''}`}
          />
          {dropdownVisible && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleViewProfile}>
                View Profile
              </button>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
