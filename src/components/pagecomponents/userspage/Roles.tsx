import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IPermission, IRole } from "@/utils/interface";
import { Button, Checkbox, Form, Input, message, Modal, Table } from "antd/lib";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import { Spin } from "antd/lib";

const RolesList: React.FC = () => {
  const {
    fetchedData: rolesData,
    loading,
    refetchData: refetchRoles,
  } = useFetchData("/roles");
  const { fetchedData: permissionsData } = useFetchData("/permissions");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IRole[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPermissions, setModalPermissions] = useState<IPermission[]>([]);

  useEffect(() => {
    if (rolesData?.success) {
      setFilteredData(rolesData.data.result);
    }
  }, [rolesData]);

  useEffect(() => {
    if (permissionsData?.success) {
      setPermissions(permissionsData.data.result);
    }
  }, [permissionsData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = rolesData.data.result.filter((role: IRole) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEditClick = (role: IRole) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map((permission) => permission.id),
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingRole(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/roles/${id}`);
      message.success("Role deleted successfully!");
      refetchRoles();
    } catch (error) {
      message.error("Failed to delete role.");
      console.error("Error:", error);
    }
  };

  const showModal = (permissions: IPermission[]) => {
    setModalPermissions(permissions);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: () => <Checkbox />,
      width: 50,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: IPermission[]) => (
        <div className="flex flex-wrap gap-2">
          {permissions.slice(0, 5).map((permission) => (
            <span
              key={permission.id}
              className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-lg"
            >
              {permission.name}
            </span>
          ))}
          {permissions.length > 5 && (
            <>
              <Button
                type="link"
                className="text-blue-600"
                onClick={() => showModal(permissions)}
              >
                +{permissions.length - 5} more
              </Button>
            </>
          )}
        </div>
      ),
      width: 250,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IRole) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditClick(record)} icon={<FaEdit />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<FaTrash />}
            danger
          />
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <section className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search by role name"
              value={searchText}
              onChange={handleSearch}
              style={{ width: "300px" }}
            />
            <AddRoleModal refetchData={refetchRoles} />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            className="bg-white"
          />

          <EditRoleModal
            visible={isEditModalVisible}
            onCancel={handleEditCancel}
            role={editingRole}
            refetchRoles={refetchRoles}
          />

          {/* Permissions Modal */}
          <Modal
            title="All Permissions"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>,
            ]}
          >
            <div className="flex flex-wrap gap-2 max-h-96 overflow-auto">
              {modalPermissions.map((permission) => (
                <span
                  key={permission.id}
                  className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-lg"
                >
                  {permission.name}
                </span>
              ))}
            </div>
          </Modal>
        </>
      )}
    </section>
  );
};

export default RolesList;
