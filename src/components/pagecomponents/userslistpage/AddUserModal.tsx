import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, message, Switch } from "antd/lib";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface AddUserModalProps {
  refetchData: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ refetchData }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const [form] = Form.useForm();

  const handleCreateUser = async (values: any) => {
    const {
      email,
      password,
      password2,
      phone,
      blocked_reason,
      isActive,
      email_verified,
      deleted,
    } = values;

    if (password !== password2) {
      message.error("पासवर्ड मिल्दैन");
      return;
    }

    const newUser = {
      email,
      password,
      password2,
      phone,
      email_verified,
      isActive,
      blocked_reason,
      deleted,
    };

    if (!session?.user?.accessToken) {
      message.error("No access token found.");
      return;
    }

    try {
      setFormLoading(true);

      await axiosInstance.post("/user-admin/create", newUser, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });

      message.success("प्रयोगकर्ता सफलतापूर्वक सिर्जना गरियो");
      refetchData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating user", error);
      message.error("प्रयोगकर्ता सिर्जना गर्न समस्या आएको छ");
    } finally {
      setFormLoading(false);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Button to open the modal */}
      <Button type="primary" onClick={openModal}>
        Create User
      </Button>

      {/* Modal for creating user */}
      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          initialValues={{
            isActive: true,
            email_verified: true,
            deleted: false,
          }}
        >
          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "कृपया इमेल प्रविष्ट गर्नुहोस्" },
              { type: "email", message: "कृपया वैध इमेल प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input placeholder="test@example.com" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "कृपया पासवर्ड प्रविष्ट गर्नुहोस्" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label="Confirm Password"
            name="password2"
            dependencies={["password"]}
            rules={[
              { required: true, message: "कृपया पासवर्ड पुष्टि गर्नुहोस्" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("पासवर्ड मिल्दैन"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          {/* Phone Field */}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "कृपया फोन नम्बर प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          {/* Blocked Reason Field */}
          {/* <Form.Item
            label="Blocked Reason"
            name="blocked_reason"
            rules={[{ required: false }]}
          >
            <Input placeholder="Blocked Reason (Optional)" />
          </Form.Item> */}

          {/* Switches for email_verified, isActive, and deleted */}
          {/* <Form.Item
            label="Email Verified"
            name="email_verified"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Is Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Deleted" name="deleted" valuePropName="checked">
            <Switch />
          </Form.Item> */}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={formLoading}>
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserModal;
