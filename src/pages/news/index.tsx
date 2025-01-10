import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import NewsList from "@/components/pagecomponents/newspage/NewsList";

const NewsPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <NewsList />
    </PageLayout>
  );
};

export default withAuth(NewsPage);
