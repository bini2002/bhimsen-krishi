import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import AgroFirmsKYCList from "@/components/pagecomponents/agrofirmskycpage/AgroFirmsKYCList";

const AgroFirmsKYCPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <AgroFirmsKYCList />
    </PageLayout>
  );
};

export default withAuth(AgroFirmsKYCPage);
