import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import EditProfile from "@/components/pagecomponents/profile/EditProfile";

const EditProfilePage = () => {
  return (
    <PageLayout>
      <EditProfile />
    </PageLayout>
  );
};

export default withAuth(EditProfilePage);
