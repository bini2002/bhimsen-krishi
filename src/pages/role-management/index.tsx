// src/pages/index.tsx
import {
  GoBackButton,
  PrimaryButton,
} from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import PermissionsList from "@/components/pagecomponents/userspage/Permissions";
import RolesList from "@/components/pagecomponents/userspage/Roles";
import RoleAssignment from "@/components/pagecomponents/userspage/RoleAssignment";
import UsersList from "@/components/pagecomponents/userspage/RoleAssignment";
import { Tabs } from "antd/lib";
import { useState } from "react";

const { TabPane } = Tabs;

const Users = () => {
  const [activeTab, setActiveTab] = useState("roles");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <PageLayout>
      <GoBackButton />
      <h1 className="text-2xl">Role Management</h1>
      <Tabs defaultActiveKey="roles" onChange={handleTabChange}>
        <TabPane tab="Roles" key="roles">
          {activeTab === "roles" && <RolesList />}
        </TabPane>
        <TabPane tab="Permissions" key="permissions">
          {activeTab === "permissions" && <PermissionsList />}
        </TabPane>
        <TabPane tab="Role Management" key="role-management">
          {activeTab === "role-management" && <RoleAssignment />}
        </TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default withAuth(Users);
