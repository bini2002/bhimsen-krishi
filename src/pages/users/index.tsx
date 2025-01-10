import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import UsersList from "@/components/pagecomponents/userslistpage/UserList";

const UsersPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <UsersList />
    </PageLayout>
  );
};

export default withAuth(UsersPage);
