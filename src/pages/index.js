// pages/user/index.js
import UserHeader from "../components/UserHeader";
import UserLayout from "../components/UserLayout";

export default function RestaurantHomePage() {
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
