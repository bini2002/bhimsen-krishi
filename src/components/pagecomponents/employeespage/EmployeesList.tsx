import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  message,
} from "antd/lib";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import AddEmployeeModal from "./AddEmployeeModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  createdAt: string;
  isActive: boolean;
  employeeType: string;
  office: string;
  position: string;
  user: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

const EmployeesList = () => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  const {
    fetchedData: employeesData,
    loading: employeesLoading,
    refetchData,
  } = useFetchData("/employees");
  const {
    fetchedData: usersData,
    loading: usersLoading,
    refetchData: refetchUsers,
  } = useFetchData("/user/employees");
  const { fetchedData: allUsersList } = useFetchData("/user");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (employeesData && usersData) {
      const mappedEmployees = employeesData.data.data.map(
        (employee: Employee) => {
          const userDetail = usersData.data.data.find(
            (user: { userId: string }) => user.userId === employee.user
          );
          return {
            ...employee,
            email: userDetail?.email || "N/A",
            profile: userDetail?.profile || null,
          };
        }
      );
      setEmployees(mappedEmployees);
    }
  }, [employeesData, usersData]);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue({
      employeeType: employee.employeeType,
      office: employee.office,
      position: employee.position,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedEmployee) return;
    try {
      const updatedEmployee = { ...values, user: selectedEmployee.user };
      await axiosInstance.patch(
        `/employees/${selectedEmployee.id}`,
        updatedEmployee
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...updatedEmployee } : emp
        )
      );
      setIsEditModalVisible(false);
      message.success("सफलतापूर्वक अद्यावधिक गरियो");
    } catch (error) {
      console.error(error);
      message.error("अद्यावधिक गर्दा समस्या आएको छ");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      message.success("कर्मचारी सफलतापूर्वक मेटाइएको छ");
    } catch (error) {
      console.error(error);
      message.error("कर्मचारी मेटाउनमा समस्या आएको छ");
    }
  };

  const handleKYC = (userId: any) => {
    router.push(`/users/add-profile/${userId}`);
  };

  const columns = [
    {
      title: "नाम",
      dataIndex: "name",
      render: (_: string, record: Employee) =>
        record.profile?.firstName && record.profile?.lastName
          ? `${record.profile.firstName} ${record.profile.lastName}`
          : "N/A",
    },
    {
      title: "इमेल",
      dataIndex: "email",
      render: (_: string, record: Employee) => record.email || "N/A",
    },
    {
      title: "कर्मचारी प्रकार",
      dataIndex: "employeeType",
      render: (type: string) => type,
    },
    {
      title: "पद",
      dataIndex: "position",
    },
    {
      title: "कार्यालय",
      dataIndex: "office",
    },
    {
      title: "स्थिति",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "सक्रिय" : "निष्क्रिय"}
        </Tag>
      ),
    },
    {
      title: "कार्यवाही",
      render: (_: string, record: Employee) => (
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          <Button
            type="dashed"
            size="small"
            onClick={() => handleEdit(record)}
            icon={<AiOutlineEdit />}
          />

          {/* Complete KYC Button */}
          {(!record.profile?.firstName || !record.profile?.lastName) && (
            <Button
              type="default"
              size="small"
              onClick={() => handleKYC(record.user)}
              className="mr-2"
            >
              KYC पूरा गर्नुहोस्
            </Button>
          )}

          {/* Delete Button */}
          <Popconfirm
            title="के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो कर्मचारीलाई मेटाउन चाहनुहुन्छ?"
            onConfirm={() => handleDelete(record.id)}
            okText="हो"
            cancelText="होइन"
          >
            <Button type="dashed" size="small" icon={<AiOutlineDelete />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">कर्मचारी सूची</h2>
      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        className="mb-4"
      >
        कर्मचारी थप्नुहोस्
      </Button>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={employeesLoading || usersLoading}
        pagination={{ pageSize: 10 }}
      />
      <AddEmployeeModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        refetchData={refetchData}
        refetchUsers={refetchUsers}
      />
      <Modal
        title="कर्मचारी सम्पादन गर्नुहोस्"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleUpdate}>
          <Form.Item
            label="प्रयोगकर्ता"
            name="user"
            rules={[
              { required: true, message: "कृपया प्रयोगकर्ता चयन गर्नुहोस्" },
            ]}
          >
            <Select placeholder="प्रयोगकर्ता चयन गर्नुहोस्">
              {allUsersList?.data?.result?.map(
                (user: { userId: string; email: string }) => (
                  <Select.Option key={user?.userId} value={user?.userId}>
                    {user?.email}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="कर्मचारी प्रकार"
            name="employeeType"
            rules={[
              { required: true, message: "कर्मचारी प्रकार चयन गर्नुहोस्" },
            ]}
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
            rules={[{ required: true, message: "कार्यालय नाम दिनुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="पद"
            name="position"
            rules={[{ required: true, message: "पद दिनुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              अद्यावधिक गर्नुहोस्
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeesList;
