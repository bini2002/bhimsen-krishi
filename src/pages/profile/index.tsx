import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import Profile from "@/components/pagecomponents/profile/Profile";

const ProfilePage = () => {
  return (
    <PageLayout>
      <Profile />
    </PageLayout>
  );
};

export default withAuth(ProfilePage);
