import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import ExpertsList from "@/components/pagecomponents/expertspage/ExpertsList";

const ExpertsPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <ExpertsList />
    </PageLayout>
  );
};

export default withAuth(ExpertsPage);
