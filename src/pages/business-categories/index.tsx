import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import BusinessCategoryList from "@/components/pagecomponents/businesscategoriespage/BusinessCategoryList";

const CostSheets = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <BusinessCategoryList />
    </PageLayout>
  );
};

export default withAuth(CostSheets);
