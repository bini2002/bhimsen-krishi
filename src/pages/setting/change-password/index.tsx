import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd/lib";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/utils/axiosInstance";

const ChangePasswordPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!session?.user?.accessToken) {
      message.error("You must be logged in to change your password.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        "/auth/change-password",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      message.success("Password changed successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <GoBackButton />
      <div className="mt-6 md:max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="पुरानो पासवर्ड"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "कृपया पुरानो पासवर्ड प्रविष्ट गर्नुहोस्!",
              },
            ]}
          >
            <Input.Password placeholder="तपाईंको पुरानो पासवर्ड प्रविष्ट गर्नुहोस्" />
          </Form.Item>

          <Form.Item
            label="नयाँ पासवर्ड"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "कृपया नयाँ पासवर्ड प्रविष्ट गर्नुहोस्!",
              },
            ]}
          >
            <Input.Password placeholder="तपाईंको नयाँ पासवर्ड प्रविष्ट गर्नुहोस्" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageLayout>
  );
};

export default ChangePasswordPage;
