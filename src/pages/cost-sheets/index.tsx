import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import CostSheetsList from "@/components/pagecomponents/costsheetpage/CostSheetsList";

const CostSheets = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <CostSheetsList />
    </PageLayout>
  );
};

export default withAuth(CostSheets);
