import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, message } from "antd/lib";
import { useRouter } from "next/router";

const AddUser = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const response = await axiosInstance.post('/user-admin/create', {
        email: values.email,
        password: values.password,
        password2: values.password2,
        email_verified: values.email_verified,
        isActive: values.isActive,
        blocked_reason: values.blocked_reason,
        deleted: values.deleted,
        phone: values.phone
      });
      message.success('User added successfully');
      router.push('/users'); // Redirect to users list or any other page
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Failed to add user');
    }
  };

  return (
    <PageLayout>
      <GoBackButton />
      <h1 className="text-2xl font-bold mb-6">Add User</h1>
      <Form
        form={form}
        name="add-user"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ email_verified: false, isActive: false, deleted: false }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="password2"
          rules={[{ required: true, message: 'Please confirm the password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="email_verified" valuePropName="checked" className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            Email Verified
          </label>
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked" className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            Active
          </label>
        </Form.Item>

        <Form.Item name="deleted" valuePropName="checked" className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            Deleted
          </label>
        </Form.Item>

        <Form.Item
          label="Blocked Reason"
          name="blocked_reason"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add User
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
};

export default withAuth(AddUser);
