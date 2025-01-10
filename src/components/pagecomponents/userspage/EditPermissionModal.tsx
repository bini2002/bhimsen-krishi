// src/components/pagecomponents/permissionspage/EditPermissionModal.tsx

import { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd/lib";
import { IPermission } from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";
import { RequestMethod, RequestMethodLabels } from "@/utils/RequestMethod";

interface EditPermissionModalProps {
  initialValues: IPermission;
  refetchData: () => void;
  onSave: (permission: IPermission) => void;
  onClose: () => void;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  initialValues,
  refetchData,
  onSave,
  onClose,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      method: initialValues.method.toString() // Ensure method is a string for Select
    });
  }, [initialValues, form]);

  const handleSave = async (values: any) => {
    try {
      // Send method as string
      const methodString = values.method;
      await axiosInstance.patch(`/permissions/${initialValues.id}`, { ...values, method: methodString });
      message.success("Permission updated successfully!");
      refetchData();
      onSave({ ...initialValues, ...values, method: methodString });
      onClose();
    } catch (error) {
      message.error("Failed to update permission.");
      console.error("Error updating permission:", error);
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
          Save
        </Button>
        <Button onClick={onClose} style={{ marginLeft: '8px' }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditPermissionModal;
