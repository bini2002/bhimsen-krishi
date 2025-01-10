import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import FarmersKYCList from "@/components/pagecomponents/farmerskycpage/FramersKYCList";

const FarmersKYCPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <FarmersKYCList />
    </PageLayout>
  );
};

export default withAuth(FarmersKYCPage);
