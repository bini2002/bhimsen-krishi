import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import CategoriesList from "@/components/pagecomponents/categoriespage/CategoriesList";

export default function CategoriesPage() {
  return (
    <PageLayout>
      <GoBackButton />
      <CategoriesList />
    </PageLayout>
  );
}
