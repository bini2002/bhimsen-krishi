/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// CropsList.tsx

import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { ICrop, ICropType, IImage, ISeason } from "@/utils/interface";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd/lib";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddCropModal from "./AddCropModal";
import Image from "next/image";

const { Option } = Select;

// Utility function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "जन",
    "फेब",
    "मार्च",
    "अप्रिल",
    "मय",
    "जुन",
    "जुलाई",
    "अगस्ट",
    "सेप्टेम्बर",
    "अक्टोबर",
    "नोभेम्बर",
    "डिसेम्बर",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const CropsList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData(
    "/crop-calendar/crop-calendar"
  );
  const { fetchedData: typesData } = useFetchData("/crop-calendar/crop-type");
  const { fetchedData: seasonsData } = useFetchData("/crop-calendar/season");
  const { fetchedData: imagesData } = useFetchData("/imageupload");

  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ICrop[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCrop, setEditingCrop] = useState<ICrop | null>(null);
  const [types, setTypes] = useState<ICropType[]>([]);
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [images, setImages] = useState<IImage[]>([]);
  const [form] = Form.useForm();

  // Effect to set filtered data when fetched data changes
  useEffect(() => {
    if (fetchedData && fetchedData.success) {
      setFilteredData(fetchedData.data.result);
    }
  }, [fetchedData]);

  // Fetch types, seasons, and images data
  useEffect(() => {
    if (typesData && typesData.success) {
      setTypes(typesData.data.data);
    }
    if (seasonsData && seasonsData.success) {
      setSeasons(seasonsData.data.result);
    }
    if (imagesData && imagesData.success) {
      setImages(imagesData.data.result);
    }
  }, [typesData, seasonsData, imagesData]);


  // Search handler to filter crops by name
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = fetchedData.data.result.filter((crop: ICrop) =>
      crop.cropName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle editing a crop
  const handleEditClick = (crop: ICrop) => {
    setEditingCrop(crop);
    form.setFieldsValue({
      cropName: crop.cropName,
      description: crop.description,
      types: crop.types.map((type) => type.id),
      seasons: crop.seasons.map((season) => season.id),
      image: crop.image?.id, // Set the selected image ID
    });
    setIsEditModalVisible(true);
  };

  // Handle canceling the edit modal
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Handle saving the edited crop
  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingCrop) {
        axiosInstance
          .patch(`/crop-calendar/crop-calendar/${editingCrop.id}`, {
            cropName: values.cropName,
            description: values.description,
            types: values.types,
            seasons: values.seasons,
            image: values.image, // Use the selected image ID
          })
          .then(() => {
            message.success("फसल सफलतापूर्वक अपडेट गरियो!");
            setIsEditModalVisible(false);
            // Update the local state to reflect the changes
            setFilteredData((prevData) =>
              prevData.map((crop) =>
                crop.id === editingCrop.id ? { ...crop, ...values } : crop
              )
            );
            refetchData();
          })
          .catch((error) => {
            message.error("फसल अपडेट गर्न असफल।");
            console.error("Error updating crop:", error);
          });
      }
    });
  };

  // Handle deleting a crop
  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/crop-calendar/crop-calendar/${id}`)
      .then(() => {
        message.success("फसल सफलतापूर्वक मेटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("फसल मेटाउन असफल।");
        console.error("Error deleting crop:", error);
      });
  };

  // Define table columns
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
      title: "फसलको नाम",
      dataIndex: "cropName",
      key: "cropName",
      width: 150,
    },
    {
      title: "तस्वीर",
      dataIndex: "image",
      key: "image",
      render: (image: { id: number; createdAt: string; image: string }) => (
        <>
          {image.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`}
              className=" object-cover"
              alt="फसल"
              width={100}
              height={100}
            />
          )}
        </>
      ),
      width: "15%",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "प्रकार",
      dataIndex: "types",
      key: "types",
      render: (types: ICropType[]) => (
        <ul>
          {types.map((type) => (
            <li key={type.id}>{type.type}</li>
          ))}
        </ul>
      ),
      width: 150,
    },
    {
      title: "मौसम",
      dataIndex: "seasons",
      key: "seasons",
      render: (seasons: ISeason[]) => (
        <ul>
          {seasons.map((season) => (
            <li key={season.id}>{season.seasonName}</li>
          ))}
        </ul>
      ),
      width: 200,
    },
    {
      title: "कार्य",
      key: "action",
      render: (text: any, record: ICrop) => (
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
      <h1 className="text-xl lg:text-2xl font-medium mb-4">फसलको सूची</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="फसलको नामले खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <AddCropModal refetchData={refetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="फसल सम्पादन गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            सुरक्षित गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cropName"
            label="फसलको नाम"
            rules={[{ required: true, message: "कृपया फसलको नाम लेख्नुहोस्!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="image" label="तस्वीर">
            <Select>
              {images.map((image) => (
                <Option key={image.id} value={image.id}>
                  {image.image}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="विवरण"
            rules={[{ required: true, message: "कृपया विवरण लेख्नुहोस्!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="types"
            label="प्रकारहरू"
            rules={[
              { required: true, message: "कृपया प्रकारहरू चयन गर्नुहोस्!" },
            ]}
          >
            <Select mode="multiple" placeholder="प्रकार चयन गर्नुहोस्">
              {types.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="seasons"
            label="मौसमहरू"
            rules={[
              { required: true, message: "कृपया मौसमहरू चयन गर्नुहोस्!" },
            ]}
          >
            <Select mode="multiple" placeholder="मौसम चयन गर्नुहोस्">
              {seasons.map((season) => (
                <Option key={season.id} value={season.id}>
                  {season.seasonName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default CropsList;
