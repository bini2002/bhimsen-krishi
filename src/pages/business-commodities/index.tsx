import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import BusinessCommodityList from "@/components/pagecomponents/businesscommoditiespage/BusinessCommodityList";

const CostSheets = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <BusinessCommodityList />
    </PageLayout>
  );
};

export default withAuth(CostSheets);
