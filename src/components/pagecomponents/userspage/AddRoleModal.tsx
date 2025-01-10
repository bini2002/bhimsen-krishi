import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IPermission } from "@/utils/interface";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import { useState } from "react";

const { Option } = Select;

interface AddRoleModalProps {
  refetchData: () => void;
}

const AddRoleModal = ({ refetchData }: AddRoleModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const { fetchedData: permissionsData, loading: loadingPermissions } =
    useFetchData("/permissions");

  const handleSave = () => {
    form.validateFields().then((values) => {
      const permissions = values.permissions || [];

      axiosInstance
        .post("/roles", {
          name: values.name,
          description: values.description,
          permissions,
        })
        .then((response) => {
          message.success("Role added successfully!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("Failed to add role.");
          console.error("Error adding role:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => setIsVisible(true)}
      >
        Add New Role
      </Button>
      <Modal
        title="Add New Role"
        visible={isVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {/* Role Name */}
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter the role name" }]}
          >
            <Input />
          </Form.Item>

          {/* Role Description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* Permissions */}
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[
              {
                required: true,
                message: "Please select at least one permission",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              loading={loadingPermissions}
              defaultValue={[]}
            >
              {permissionsData?.data?.data?.map((permission: IPermission) => (
                <Option key={permission.id} value={permission.id}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddRoleModal;
