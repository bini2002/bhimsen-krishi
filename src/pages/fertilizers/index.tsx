import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import FertilizersList from "@/components/pagecomponents/fertilizerslistpage/FertilizersList";

const Crops = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <FertilizersList />
    </PageLayout>
  );
};

export default withAuth(Crops);
