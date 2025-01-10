import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface AddExpertModalProps {
  refetchData: () => void; // Keep refetchData prop
  refetchUsers: () => void; // Keep refetchUsers prop
}

const AddExpertModal: React.FC<AddExpertModalProps> = ({
  refetchData,
  refetchUsers,
}) => {
  const [usersData, setUsersData] = useState<any>(null);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Local state for modal visibility

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsersData = async () => {
      if (!session?.user?.accessToken) {
        message.error("No access token found.");
        return;
      }

      try {
        setUsersLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        if (response?.data?.success) {
          setUsersData(response?.data);
        } else {
          message.error("Failed to fetch users data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Something went wrong while fetching users data.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsersData();
  }, [session]);

  const [form] = Form.useForm();

  const handleAddExpert = async (values: any) => {
    const { user, type } = values;

    const newExpert = {
      user,
      type,
    };

    if (!session?.user?.accessToken) {
      message.error("No access token found.");
      return;
    }

    try {
      await axiosInstance.post("/experts", newExpert, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      message.success("विशेषज्ञ सफलतापूर्वक थपियो");
      refetchData(); // Refetch expert data
      refetchUsers(); // Refetch users list
      setIsModalVisible(false); // Close the modal after adding expert
    } catch (error) {
      console.error("Error adding expert", error);
      message.error("विशेषज्ञ थप्ने क्रममा समस्या आएको छ");
    }
  };

  const openModal = () => {
    setIsModalVisible(true); // Open modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close modal
  };

  return (
    <>
      {/* Button to open the modal */}
      <Button type="primary" onClick={openModal}>
        नयाँ विशेषज्ञ थप्नुहोस्
      </Button>

      {/* Modal */}
      <Modal
        title="नयाँ विशेषज्ञ थप्नुहोस्"
        open={isModalVisible} // Control modal visibility
        onCancel={closeModal} // Close modal on cancel
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddExpert}>
          <Form.Item
            label="प्रयोगकर्ता"
            name="user"
            rules={[
              { required: true, message: "कृपया प्रयोगकर्ता चयन गर्नुहोस्" },
            ]}
          >
            <Select
              placeholder="प्रयोगकर्ता चयन गर्नुहोस्"
              loading={usersLoading}
              allowClear
            >
              {usersData?.data?.result?.map(
                (user: { userId: string; email: string }) => (
                  <Select.Option key={user.userId} value={user.userId}>
                    {user.email}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="विशेषज्ञ प्रकार"
            name="type"
            rules={[
              {
                required: true,
                message: "कृपया विशेषज्ञ प्रकार प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input placeholder="विशेषज्ञ प्रकार प्रविष्ट गर्नुहोस्" />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={usersLoading}>
              विशेषज्ञ थप्नुहोस्
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddExpertModal;
