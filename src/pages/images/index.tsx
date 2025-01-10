import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import ImagesList from "@/components/pagecomponents/images/ImagesList";

const Images = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <ImagesList/>
    </PageLayout>
  );
};

export default withAuth(Images);
