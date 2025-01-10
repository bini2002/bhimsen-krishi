import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import CropsList from "@/components/pagecomponents/cropspage/CropsList";

const Crops = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <CropsList />
    </PageLayout>
  );
};

export default withAuth(Crops);
