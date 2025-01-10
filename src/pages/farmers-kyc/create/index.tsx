import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import AddOtherFarmerKYCModal from "@/components/pagecomponents/farmerskycpage/AddOtherFarmerKyc";

export default function CreateFarmerKycPage() {
  return (
    <PageLayout>
      <GoBackButton />
      <AddOtherFarmerKYCModal />
    </PageLayout>
  );
}
