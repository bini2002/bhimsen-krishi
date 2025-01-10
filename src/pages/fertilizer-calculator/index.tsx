import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import FertilizerCalculator from "@/components/pagecomponents/calculatorpage/FertilizerCalculator";

const FertilizerCalculatorPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <FertilizerCalculator />
    </PageLayout>
  );
};

export default withAuth(FertilizerCalculatorPage);
