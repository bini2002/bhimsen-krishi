import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import EmployeesList from "@/components/pagecomponents/employeespage/EmployeesList";

const EmployeesPage = () => {
  
  return (
    <PageLayout>
      <GoBackButton />
      <EmployeesList />
    </PageLayout>
  );
};

export default withAuth(EmployeesPage);
