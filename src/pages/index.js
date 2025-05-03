import UserHeader from "../components/UserHeader";
import HomePageContent from "../components/HomePageContent";

export default function HomePage() {
  return (
    <>
      <UserHeader preLogin={true} />
      <HomePageContent requireLogin={true} />
    </>
  );
}