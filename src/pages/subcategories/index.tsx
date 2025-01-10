import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import SubCatList from "@/components/pagecomponents/subcategories/SubCatList";

export default function CategoriesPage() {
  return (
    <PageLayout>
      <GoBackButton />
      <SubCatList />
    </PageLayout>
  );
}
