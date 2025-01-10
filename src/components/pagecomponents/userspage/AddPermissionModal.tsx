// src/components/pagecomponents/permissionspage/AddPermissionModal.tsx

import { Form, Input, Button, Select, message } from "antd/lib";
import { IPermission } from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";
import { RequestMethod, RequestMethodLabels } from "@/utils/RequestMethod";

interface AddPermissionModalProps {
  refetchData: () => void;
  onClose: () => void;
}

const AddPermissionModal: React.FC<AddPermissionModalProps> = ({
  refetchData,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    try {
      // Send method as string
      const methodString = values.method;
      await axiosInstance.post(`/permissions`, { ...values, method: methodString });
      message.success("Permission added successfully!");
      refetchData();
      onClose();
    } catch (error) {
      message.error("Failed to add permission.");
      console.error("Error adding permission:", error);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSave}
      layout="vertical"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Path"
        name="path"
        rules={[{ required: true, message: 'Please input the path!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Method"
        name="method"
        rules={[{ required: true, message: 'Please select the method!' }]}
      >
        <Select placeholder="Select a method">
          {Object.entries(RequestMethodLabels).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
        <Button onClick={onClose} style={{ marginLeft: '8px' }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPermissionModal;
