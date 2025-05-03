import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Make sure js-cookie is installed
import UserHeader from "../components/UserHeader";
import HomePageContent from "../components/HomePageContent";

export default function HomePage() {
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
      <UserHeader preLogin={true} />
      <HomePageContent requireLogin={true} />
    </>
  );
}