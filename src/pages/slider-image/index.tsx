import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import SLiderImagesList from "@/components/pagecomponents/sliderimage/SliderImagesList";

const Images = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <SLiderImagesList/>
    </PageLayout>
  );
};

export default withAuth(Images);
