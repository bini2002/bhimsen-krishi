import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IPermission } from "@/utils/interface";
import { Button, Input, Modal, Spin, Table, message } from "antd/lib";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddPermissionModal from "./AddPermissionModal";
import { RequestMethod, RequestMethodLabels } from "@/utils/RequestMethod";
import EditPermissionModal from "./EditPermissionModal";

const PermissionsList: React.FC = () => {
  const {
    fetchedData: permissionsData,
    loading,
    refetchData,
  } = useFetchData("/permissions");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IPermission[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<IPermission | null>(null);

  useEffect(() => {
    if (permissionsData && permissionsData.success) {
      setFilteredData(permissionsData.data.data);
    }
  }, [permissionsData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = permissionsData?.data.data.filter((permission: any) =>
      permission.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered || []);
  };

  const handleAddClick = () => {
    setIsAddModalVisible(true);
  };

  const handleEditClick = (permission: IPermission) => {
    setEditingPermission(permission);
    setIsEditModalVisible(true);
  };

  const handleEditSave = (updatedPermission: IPermission) => {
    axiosInstance
      .patch(`/permissions/${updatedPermission.id}`, updatedPermission)
      .then(() => {
        message.success("Permission updated successfully!");
        setIsEditModalVisible(false);
        refetchData();
      })
      .catch((error) => {
        message.error("Failed to update permission.");
        console.error("Error updating permission:", error);
      });
  };

  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/permissions/${id}`)
      .then(() => {
        message.success("Permission deleted successfully!");
        refetchData();
      })
      .catch((error) => {
        message.error("Failed to delete permission.");
        console.error("Error deleting permission:", error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: RequestMethod) =>
        RequestMethodLabels[method] || "Unknown",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: IPermission) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditClick(record)} icon={<FaEdit />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<FaTrash />}
            className="hover:text-red-500"
          />
        </div>
      ),
    },
  ];

  return (
    <section className="">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search by name"
              value={searchText}
              onChange={handleSearch}
              style={{ width: "300px" }}
            />
            <Button type="primary" onClick={handleAddClick}>
              Add Permission
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            className="bg-white"
          />
          <Modal
            title="Add Permission"
            visible={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            footer={null}
          >
            <AddPermissionModal
              refetchData={refetchData}
              onClose={() => setIsAddModalVisible(false)}
            />
          </Modal>
          <Modal
            title="Edit Permission"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            {editingPermission && (
              <EditPermissionModal
                refetchData={refetchData}
                initialValues={editingPermission}
                onSave={handleEditSave}
                onClose={() => setIsEditModalVisible(false)}
              />
            )}
          </Modal>
        </>
      )}
    </section>
  );
};

export default PermissionsList;
