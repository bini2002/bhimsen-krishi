/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// FertilizersList.tsx

import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IFertilizer, IImage } from "@/utils/interface";
import { Button, Form, Input, Modal, Select, Table, message } from "antd/lib";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddFertilizerModal from "./AddFertilizerModal";
import Image from "next/image";

const { Option } = Select;

const FertilizersList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData(
    "/fertilizer-calculator/npk"
  );
  const { fetchedData: images } = useFetchData("/imageupload");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IFertilizer[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFertilizer, setEditingFertilizer] =
    useState<IFertilizer | null>(null);
  const [form] = Form.useForm();

  // Effect to set filtered data when fetched data changes
  useEffect(() => {
    if (fetchedData && fetchedData.success) {
      setFilteredData(fetchedData.data.result);
    }
  }, [fetchedData]);

  // Search handler to filter fertilizers by name
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = fetchedData.data.result.filter((fertilizer: IFertilizer) =>
      fertilizer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle editing a fertilizer
  const handleEditClick = (fertilizer: IFertilizer) => {
    setEditingFertilizer(fertilizer);
    form.setFieldsValue({
      name: fertilizer.name,
      nitrogen: fertilizer.nitrogen,
      phosphorous: fertilizer.phosphorous,
      potassium: fertilizer.potassium,
      image: fertilizer.image?.id, // Set the selected image ID
    });
    setIsEditModalVisible(true);
  };

  // Handle canceling the edit modal
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Handle saving the edited fertilizer
  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingFertilizer) {
        axiosInstance
          .patch(`/fertilizer-calculator/npk/${editingFertilizer.id}`, {
            name: values.name,
            nitrogen: values.nitrogen,
            phosphorous: values.phosphorous,
            potassium: values.potassium,
            image: values.image, // Use the selected image ID
          })
          .then(() => {
            message.success("खादको सफलतापूर्वक अपडेट गरियो!");
            setIsEditModalVisible(false);
            // Update the local state to reflect the changes
            setFilteredData((prevData) =>
              prevData.map((fertilizer) =>
                fertilizer.id === editingFertilizer.id
                  ? { ...fertilizer, ...values }
                  : fertilizer
              )
            );
            refetchData();
          })
          .catch((error) => {
            message.error("खादलाई अपडेट गर्न असफल।");
            console.error("खाद अपडेट गर्दा त्रुटि:", error);
          });
      }
    });
  };

  // Handle deleting a fertilizer
  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/fertilizer-calculator/npk/${id}`)
      .then(() => {
        message.success("खाद सफलतापूर्वक हटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("खाद हटाउन असफल।");
        console.error("खाद हटाउँदा त्रुटि:", error);
      });
  };

  // Define table columns
  const columns = [
    {
      title: "आईडी",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "नाम",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "तस्बिर",
      dataIndex: "image",
      key: "image",
      render: (image: { id: number; createdAt: string; image: string }) => (
        <>
          {image.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
              className="object-cover"
              alt="खाद"
              width={100}
              height={100}
            />
          )}
        </>
      ),
      width: "15%",
    },
    {
      title: "नाइट्रोजन",
      dataIndex: "nitrogen",
      key: "nitrogen",
      width: 150,
    },
    {
      title: "फस्फोरस",
      dataIndex: "phosphorous",
      key: "phosphorous",
      width: 150,
    },
    {
      title: "पोटासियम",
      dataIndex: "potassium",
      key: "potassium",
      width: 150,
    },
    {
      title: "क्रिया",
      key: "action",
      render: (text: any, record: IFertilizer) => (
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
    <section>
      <h1 className="text-xl lg:text-2xl font-medium mb-4">खादको सूची</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="खादको नामले खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <AddFertilizerModal refetchData={refetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="खाद सम्पादन गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            बचत गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="नाम"
            rules={[
              { required: true, message: "कृपया नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imageId"
            label="छवि"
            rules={[{ required: true, message: "कृपया एक छवि छान्नुहोस्" }]}
          >
            <Select placeholder="छवि छान्नुहोस्">
              {images?.data?.result?.map((image: IImage) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`;
                return (
                  <Option key={image.id} value={image.id}>
                    <div className="flex gap-3 items-center">
                      <Image src={imageUrl} alt="बाली" width={28} height={28} />
                      <span>{`${image?.name}`}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="nitrogen"
            label="नाइट्रोजन"
            rules={[
              {
                required: true,
                message: "कृपया नाइट्रोजन सामग्री प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phosphorous"
            label="फस्फोरस"
            rules={[
              {
                required: true,
                message: "कृपया फस्फोरस सामग्री प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="potassium"
            label="पोटासियम"
            rules={[
              {
                required: true,
                message: "कृपया पोटासियम सामग्री प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default FertilizersList;
