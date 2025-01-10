import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IRole, IPermission } from "@/utils/interface";
import { Button, message, Modal, Select, Input } from "antd/lib";
import React, { useEffect, useState } from "react";

interface EditRoleModalProps {
  visible?: boolean;
  onCancel?: () => void;
  role?: IRole | null;
  refetchRoles?: () => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  visible,
  onCancel,
  role,
  refetchRoles,
}) => {
  const [roleName, setRoleName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newPermission, setNewPermission] = useState<string>(""); // For new permission
  const { fetchedData: permissionsData, loading: loadingPermissions } =
    useFetchData("/permissions");

  useEffect(() => {
    if (role) {
      const initialPermissions =
        role.permissions?.map((perm) => perm.id.toString()) || [];
      setSelectedPermissions(initialPermissions);
      setRoleName(role.name || "");
      setDescription(role.description || "");
    }
  }, [role]);

  const handlePermissionChange = (value: string[]) => {
    setSelectedPermissions(value);
  };

  const handleAddNewPermission = () => {
    if (newPermission && !selectedPermissions.includes(newPermission)) {
      setSelectedPermissions((prev) => [...prev, newPermission]);
      setNewPermission(""); // Clear the input field after adding
    } else {
      message.error("Invalid or duplicate permission");
    }
  };

  const handleSave = async () => {
    if (!roleName || !description || selectedPermissions.length === 0) {
      message.error(
        "Please fill all fields and select at least one permission"
      );
      return;
    }

    try {
      const existingPermissionIds = role?.permissions?.map((p) => p.id) || [];
      const payload = {
        name: roleName,
        description,
        permissions: selectedPermissions.map(Number), // Convert selected IDs to numbers
        deletePermissions: existingPermissionIds
          .filter((id) => !selectedPermissions.includes(id.toString()))
          .map(String),
      };

      const res = await axiosInstance.patch(`/roles/${role?.id}`, payload);

      if (res.status === 200) {
        message.success("Role updated successfully!");
        refetchRoles?.();
        onCancel?.();
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      message.error("Failed to update role.");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Edit Role"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
      width={600}
    >
      <div className="flex flex-col gap-4">
        {/* Role Name */}
        <div>
          <label htmlFor="roleName" className="font-bold">
            Role Name:
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-bold">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter role description"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            rows={4}
          />
        </div>

        {/* Permissions */}
        <div>
          <label htmlFor="permissions" className="font-bold">
            Permissions:
          </label>
          <Select
            mode="multiple"
            value={selectedPermissions}
            onChange={handlePermissionChange}
            options={
              permissionsData?.data?.data.map((perm: IPermission) => ({
                label: perm.name,
                value: perm.id.toString(),
              })) || []
            }
            className="w-full mt-2"
            loading={loadingPermissions}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditRoleModal;
