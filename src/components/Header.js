import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import styles from '../styles/Header.module.css';

export default function Header({ userName = "John" }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleViewProfile = () => {
    console.log('View Profile clicked');
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerRight}>
        <div className={styles.userMenu} onClick={toggleDropdown}>
          <FaUserCircle className={styles.icon} />
          <span className={styles.greeting}>Hello, {userName}!</span>
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
