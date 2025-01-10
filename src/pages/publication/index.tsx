import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import PublicationsList from "@/components/pagecomponents/publicationpage/PublicationsList";

const Publication = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <PublicationsList />
    </PageLayout>
  );
};

export default withAuth(Publication);
