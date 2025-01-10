// src/pages/404.tsx

import PageLayout from "@/components/globalcomponents/PageLayout";
import { Result, Button, Space } from "antd/lib";
import React from "react";
import { useRouter } from "next/router";
import { GoBackButton } from "@/components/globalcomponents/Button";

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleBackHome = () => {
    router.push("/"); // Navigate to homepage or desired route
  };

  return (
    <PageLayout>
      <GoBackButton />

      <div className="flex items-center justify-center h-screen">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, this page is under construction."
          extra={
            <Space>
              <Button type="primary" onClick={handleBackHome}>
                Back to Home
              </Button>
            </Space>
          }
        />
      </div>
    </PageLayout>
  );
};

export default NotFound;
