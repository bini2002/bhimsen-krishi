// src/components/pagecomponents/imagepage/SLiderImagesList.tsx

import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { ISlider } from "@/utils/interface";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddSlideModal from "./AddSliderModal";

const { Option } = Select;

const SLiderImagesList: React.FC = () => {
  // Fetch slider data
  const { fetchedData: imagesData, refetchData: refetchSliders } =
    useFetchData("/slider");
  // Fetch images data
  const { fetchedData: imagesDataAPI, refetchData: refetchImages } =
    useFetchData("/imageupload");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ISlider[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<ISlider | null>(null);
  const [imageOptions, setImageOptions] = useState<
    { label: string; value: number; image: string }[]
  >([]);

  useEffect(() => {
    if (imagesData && imagesData.success) {
      setFilteredData(imagesData.data.result);
    }
  }, [imagesData]);

  useEffect(() => {
    if (imagesDataAPI && imagesDataAPI.success) {
      setImageOptions(
        imagesDataAPI.data.result.map((img: any) => ({
          label: img.name,
          value: img.id,
          image: img.image, // Include image URL
        }))
      );
    }
  }, [imagesDataAPI]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = imagesData?.data.result.filter((slider: ISlider) =>
      slider.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered || []);
  };

  const handleEditClick = (slider: ISlider) => {
    setEditingImage(slider);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    axiosInstance
      .delete(`/slider/${id}`)
      .then(() => {
        message.success("Image deleted successfully!");
        refetchSliders();
      })
      .catch((error) => {
        message.error("Failed to delete image.");
        console.error("Error deleting image:", error);
      });
  };

  const handleEditSave = (values: any) => {
    if (!editingImage) return;

    const data = {
      title: values.title,
      description: values.description,
      featuredImage: values.featuredImage,
    };

    axiosInstance
      .patch(`/slider/${editingImage.id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        message.success("Image updated successfully!");
        setIsEditModalVisible(false);
        setEditingImage(null);
        refetchSliders();
      })
      .catch((error) => {
        message.error("Failed to update image.");
        console.error("Error updating image:", error);
      });
  };

  const columns = [
    {
      title: "आईडी", // ID
      dataIndex: "id",
      key: "id",
    },
    {
      title: "शीर्षक", // Title
      dataIndex: "title",
      key: "title",
    },
    {
      title: "विवरण", // Description
      dataIndex: "description",
      key: "description",
    },
    {
      title: "फोटो", // Photo
      dataIndex: ["featuredImage", "image"],
      key: "image",
      render: (text: string) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${text}`}
          alt="image"
          width={100}
          height={100}
        />
      ),
    },
    {
      title: "फोटोको नाम", // Photo Name
      dataIndex: ["featuredImage", "name"],
      key: "name",
    },
    {
      title: "कार्य", // Action
      key: "action",
      render: (text: any, record: ISlider) => (
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
          placeholder="शीर्षकबाट खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <Space>
          <AddSlideModal refetchData={refetchSliders} />
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
        title="स्लाइडर सम्पादन गर्नुहोस्" // Edit Slider
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editingImage && (
          <Form
            layout="vertical"
            initialValues={{
              title: editingImage.title,
              description: editingImage.description,
              featuredImage: editingImage.featuredImage.id,
            }}
            onFinish={handleEditSave}
          >
            <Form.Item
              label="शीर्षक" // Title
              name="title"
              rules={[
                { required: true, message: "कृपया शीर्षक प्रविष्ट गर्नुहोस्" },
              ]} // Please enter the title
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="विवरण" // Description
              name="description"
              rules={[
                { required: true, message: "कृपया विवरण प्रविष्ट गर्नुहोस्" }, // Please enter the description
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="विशेष छवि" // Featured Image
              name="featuredImage"
              rules={[{ required: true, message: "कृपया छवि चयन गर्नुहोस्" }]} // Please select an image
            >
              <Select placeholder="छवि चयन गर्नुहोस्">
                {" "}
                {imageOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    <div className="flex gap-3 items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${option.image}`}
                        alt="crop"
                        width={28}
                        height={28}
                      />
                      <span>{option.label}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                सुरक्षित गर्नुहोस्
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </section>
  );
};

export default SLiderImagesList;
