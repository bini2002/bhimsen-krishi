import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import SetupProfile from "@/components/pagecomponents/profile/SetUpProfile";

const SetUPProfilePage = () => {
  return (
    <PageLayout>
      <SetupProfile />
    </PageLayout>
  );
};

export default withAuth(SetUPProfilePage);
