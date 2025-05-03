import UserLayout from "../../components/UserLayout";
import HomePageContent from "../../components/HomePageContent";

export default function UserHomePage() {
  return (
    <UserLayout>
      <HomePageContent showHeader={false} requireLogin={false} />
    </UserLayout>
  );
}