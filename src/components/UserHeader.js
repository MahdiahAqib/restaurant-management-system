import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "../styles/UserHeader.module.css";

export default function UserHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // UseEffect to retrieve user data from cookies
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    router.push("/");
  };

  const handleEditProfile = () => {
    router.push("/user/edit-profile");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.rightSection}>
        {user ? (
          // Display User Info and Dropdown if user is logged in
          <div className={styles.userMenu} onClick={toggleDropdown}>
            <FaUserCircle className={styles.icon} />
            <span className={styles.greeting}>Hello, {user.name}</span>
            <IoIosArrowDown
              className={`${styles.arrow} ${dropdownVisible ? styles.arrowOpen : ""}`}
            />
            {dropdownVisible && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={handleEditProfile}>
                  View Profile
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Display Login Button if user is not logged in
          <button onClick={handleLoginClick} className={styles.signInBtn}>
            Log In
          </button>
        )}
      </div>
    </div>
  );
}
