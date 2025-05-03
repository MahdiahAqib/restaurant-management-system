// pages/user/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Make sure js-cookie is installed
import UserHeader from "../components/UserHeader";
import UserLayout from "../components/UserLayout";

export default function RestaurantHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if the 'user' cookie exists
    const userCookie = Cookies.get("user");
    if (userCookie) {
      // Log out the user by clearing the 'user' cookie
      Cookies.remove("user");
    }
  }, [router]); // Dependency array to trigger the effect on component mount

  return (
    <>
      {/* UserHeader stays on top */}
      <UserHeader /> 
      
      {/* Content beneath the UserHeader */}
      <div className="userContent">
        <h1>Welcome to the User Dashboard</h1>
        <p>This is your main user area.</p>
        <p>Write Restaurant about detail etc here.</p>
      </div>
    </>
  );
}
