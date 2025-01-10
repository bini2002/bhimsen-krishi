import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import ReportsList from "@/components/pagecomponents/reportsPage/ReportsList";
import useFetchData from "@/hook/useFetchData";
import { useSession } from "next-auth/react";

const ReportPage = () => {
  const { fetchedData } = useFetchData("/report");
  const { data } = useSession();
  return (
    <PageLayout>
      <GoBackButton />
      <ReportsList />
    </PageLayout>
  );
};

export default withAuth(ReportPage);
