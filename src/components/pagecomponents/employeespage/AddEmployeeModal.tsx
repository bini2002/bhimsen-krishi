import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  refetchData: () => void;
  refetchUsers: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  visible,
  onClose,
  refetchData,
  refetchUsers,
}) => {
  const [usersData, setUsersData] = useState<any>(null);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
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
        message.error("Something went wrong while fetching data.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const [form] = Form.useForm();

  const handleAddEmployee = async (values: any) => {
    const { user, employeeType, office, position } = values;

    const newEmployee = {
      user,
      employeeType,
      office,
      position,
    };

    try {
      setUsersLoading(true);
      await axiosInstance.post("/employees", newEmployee);
      message.success("कर्मचारी सफलतापूर्वक थपियो");
      refetchData();
      refetchUsers();
      onClose();
      setUsersLoading(false);
    } catch (error) {
      console.error("Error adding employee", error);
      message.error("कर्मचारी थप्ने क्रममा समस्या आएको छ");
      setUsersLoading(false);
    }
  };

  return (
    <Modal
      title="नयाँ कर्मचारी थप्नुहोस्"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} onFinish={handleAddEmployee}>
       
        <Form.Item
          label="प्रयोगकर्ता"
          name="user"
          rules={[
            { required: true, message: "कृपया प्रयोगकर्ता चयन गर्नुहोस्" },
          ]}
        >
          <Select
            loading={usersLoading}
            placeholder="प्रयोगकर्ता चयन गर्नुहोस्"
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
          label="कर्मचारी प्रकार"
          name="employeeType"
          rules={[{ required: true, message: "कर्मचारी प्रकार चयन गर्नुहोस्" }]}
        >
          <Select>
            <Select.Option value="employee">कर्मचारी</Select.Option>
            <Select.Option value="mayor">मेयर</Select.Option>
            <Select.Option value="deputy_mayor">उप मेयर</Select.Option>
            <Select.Option value="cao">सीएओ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="कार्यालय"
          name="office"
          rules={[{ required: true, message: "कृपया कार्यालय नाम दिनुहोस्" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="पद"
          name="position"
          rules={[{ required: true, message: "कृपया पद दिनुहोस्" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={usersLoading}>
            थप्नुहोस्
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
