import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Button,
  Table,
  message,
  Modal,
  Input,
  Form,
} from "antd/lib";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface INotification {
  id: number;
  createdAt: string;
  isActive: boolean;
  title: string;
  description: string;
  featuredImage: {
    id: number;
    createdAt: string;
    isActive: boolean;
    image: string;
    name: string;
  };
}

const NotificationsList: React.FC = () => {
  const { fetchedData: notificationsData, refetchData: refetchNotifications } =
    useFetchData("/notifications");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<INotification[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState<INotification | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (notificationsData && notificationsData.success) {
      setFilteredData(notificationsData.data.data);
    }
  }, [notificationsData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = notificationsData.data.data.filter((notification: INotification) =>
      notification?.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEditClick = (notification: INotification) => {
    setEditingNotification(notification);
    form.setFieldsValue({
      title: notification?.title,
      description: notification?.description,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingNotification) {
        axiosInstance
          .patch(`/notifications/${editingNotification?.id}`, {
            title: values.title,
            description: values.description,
          })
          .then(() => {
            message.success("Notification updated successfully!");
            setIsEditModalVisible(false);
            setFilteredData((prevData) =>
              prevData.map((notification) =>
                notification?.id === editingNotification?.id ? { ...notification, ...values } : notification
              )
            );
            refetchNotifications();
          })
          .catch((error) => {
            message.error("Failed to update notification.");
            console.error("Error updating notification:", error);
          });
      }
    });
  };

  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/notifications/${id}`)
      .then(() => {
        message.success("Notification deleted successfully!");
        refetchNotifications();
      })
      .catch((error) => {
        message.error("Failed to delete notification.");
        console.error("Error deleting notification:", error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Featured Image",
      dataIndex: "featuredImage",
      key: "featuredImage",
      render: (featuredImage: { image: string }) => (
        <img src={featuredImage.image} alt="featured" style={{ width: 100, height: 100 }} />
      ),
      width: 150,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: INotification) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditClick(record)} icon={<FaEdit />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<FaTrash />}
            className="hover:text-red-500"
          />
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <section className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by title"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="Edit Notification"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter the description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default NotificationsList;
