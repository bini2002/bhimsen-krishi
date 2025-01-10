// src/components/pagecomponents/imagepage/ImagesList.tsx

import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage } from "@/utils/interface";
import {
  Button,
  Input,
  Modal,
  Table,
  message,
  Space,
  Form,
  Upload,
} from "antd/lib";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddImageModal from "./AddImageModal";
import Image from "next/image";
import { RcFile } from "antd/es/upload/interface";
import { FiUpload } from "react-icons/fi";

const ImagesList: React.FC = () => {
  const { fetchedData: imagesData, refetchData } = useFetchData("/imageupload");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IImage[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<IImage | null>(null);

  useEffect(() => {
    if (imagesData && imagesData.success) {
      setFilteredData(imagesData.data.result);
    }
  }, [imagesData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = imagesData?.data.result.filter((image: any) =>
      image.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered || []);
  };

  const handleEditClick = (image: IImage) => {
    setEditingImage(image);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    axiosInstance
      .delete(`/imageupload/${id}`)
      .then(() => {
        message.success("छवि सफलतापूर्वक मेटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("छवि मेटाउन असफल।");
        console.error("Error deleting image:", error);
      });
  };

  const handleEditSave = (values: any) => {
    if (!editingImage) return;

    const formData = new FormData();
    formData.append("name", values.name);

    if (values.image && values.image[0]) {
      formData.append("image", values.image[0].originFileObj as RcFile);
    }

    axiosInstance
      .patch(`/imageupload/${editingImage.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        message.success("छवि सफलतापूर्वक अपडेट गरियो!");
        setIsEditModalVisible(false);
        setEditingImage(null);
        refetchData();
      })
      .catch((error) => {
        message.error("छवि अपडेट गर्न असफल।");
        console.error("Error updating image:", error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "छवि",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${text}`}
          alt="छवि"
          width={200}
          height={200}
          className="rounded w-40 h-40 object-cover"
        />
      ),
    },
    {
      title: "नाम",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "कार्य",
      key: "action",
      render: (text: any, record: IImage) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditClick(record)} icon={<FaEdit />} />
          <Button
            onClick={() => handleDeleteClick(record.id)}
            icon={<FaTrash />}
            className="hover:text-red-500"
          />
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="नाम द्वारा खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <Space>
          <AddImageModal refetchData={refetchData} />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="छवि सम्पादन गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editingImage && (
          <Form
            layout="vertical"
            initialValues={{ name: editingImage.name }}
            onFinish={handleEditSave}
          >
            <Form.Item
              label="नाम"
              name="name"
              rules={[
                {
                  required: true,
                  message: "कृपया छविको नाम प्रविष्ट गर्नुहोस्",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="छवि"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e: any) => e.fileList}
              extra="एक छवि फाइल अपलोड गर्नुहोस्"
            >
              <Upload
                name="image"
                listType="picture"
                fileList={
                  editingImage.image
                    ? [
                        {
                          uid: editingImage.id.toString(),
                          name: editingImage.name,
                          status: "done",
                          url: `${process.env.NEXT_PUBLIC_API_URL}/${editingImage.image}`,
                        },
                      ]
                    : []
                }
                customRequest={({ file, onSuccess }) => {
                  // अपलोड अनुरोधको अनुकरण गर्नुहोस्
                  setTimeout(() => onSuccess?.("ok"), 0);
                }}
              >
                <Button icon={<FiUpload />}>अपलोड गर्नुहोस्</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                बचत गर्नुहोस्
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </section>
  );
};

export default ImagesList;
