import useFetchData from "@/hook/useFetchData";
import { Button, Modal, Table, Select, Form, message } from "antd/lib";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IRole, IUser } from "@/utils/interface";
import { useSession } from "next-auth/react";

const RolesList: React.FC = () => {
  const { fetchedData: roles, refetchData: refetchRoles } =
    useFetchData("/roles");

  const { fetchedData: users } = useFetchData("/user");

  const { data: session } = useSession();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>("");

  const [deleteUsers, setDeleteUsers] = useState<string[]>([]);
  const [initialUsers, setInitialUsers] = useState<IUser[]>([]);

  const showEditModal = (role: IRole) => {
    setSelectedRole(role);
    setInitialUsers(role.users);
    setIsModalVisible(true);
  };

  const handleAddUser = () => {
    if (selectedRole && selectedUserId) {
      const newUser = users?.data?.result.find(
        (user: IUser) => user?.userId === selectedUserId
      );
      if (newUser) {
        const updatedUsers = [...selectedRole.users, newUser];
        setSelectedRole({ ...selectedRole, users: updatedUsers });
        setSelectedUserId("");
        message.success("User added successfully!");
      }
    } else {
      message.error("Please select a user to add.");
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (selectedRole) {
      const updatedUsers = selectedRole.users.filter(
        (user) => user.userId !== userId
      );
      setSelectedRole({ ...selectedRole, users: updatedUsers });

      if (initialUsers.some((user) => user.userId === userId)) {
        setDeleteUsers((prev) => [...prev, userId]);
      }

      message.success("User removed successfully!");
    }
  };

  const handleSubmit = async () => {
    if (selectedRole) {
      const usersToAdd = selectedRole.users
        .filter((user) => user.isActive)
        .map((user) => user.userId);

      const usersToRemove = selectedRole.users
        .filter((user) => !user.isActive)
        .map((user) => user.userId);

      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/roles/${selectedRole.id}`,
          {
            name: selectedRole.name,
            description: selectedRole.description,
            users: usersToAdd,
            ...(deleteUsers.length > 0 && { deleteUsers }),
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        message.success("Role updated successfully!");
        setIsModalVisible(false);
        refetchRoles();
        setDeleteUsers([]);
        setInitialUsers([]);
      } catch (error) {
        message.error("Error updating role.");
      }
    }
  };

  const columns: ColumnsType<IRole> = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IRole) => (
        <Link href={`/roles/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      render: (users) => (
        <ul>
          {users?.map((user: IUser) => (
            <li key={user.userId}>{user.email} </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: IRole) => (
        <Button type="primary" onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table
        dataSource={roles?.data?.result}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Edit Role Modal */}
      <Modal
        title="Edit Role Users"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        className="rounded-lg"
      >
        <div className="space-y-8">
          {/* Existing Users Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Users</h3>
            <ul className="space-y-3">
              {selectedRole?.users.map((user) => (
                <li
                  key={user.userId}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <span className="text-gray-800">{user.email}</span>
                  <Button
                    danger
                    size="small"
                    icon={<i className="fas fa-trash-alt"></i>}
                    onClick={() => handleRemoveUser(user.userId)}
                    className="ml-3 hover:bg-red-600 transition-all"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Add New User Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <Form
              layout="vertical"
              onFinish={handleAddUser}
              className="space-y-4"
            >
              <Form.Item label="Select User">
                <Select
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  placeholder="Select a user"
                  style={{ width: "100%" }}
                  className="rounded-md"
                >
                  {users?.data?.result?.map((user: IUser) => (
                    <Select.Option key={user.userId} value={user.userId}>
                      {user.email}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<i className="fas fa-user-plus"></i>}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  Add User
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Footer Section */}
          <div className="flex justify-end space-x-4">
            <Button
              type="default"
              onClick={() => setIsModalVisible(false)}
              className="text-gray-700 border-gray-300 hover:border-gray-400 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="#6d4c41 hover:bg-green-700 transition-all"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolesList;
