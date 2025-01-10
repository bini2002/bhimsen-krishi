/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  ICategory,
  IFeaturedImage,
  IPublication,
  ISubCategory,
} from "@/utils/interface";
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
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddPublicationModal from "./AddPublicationModal";

const PublicationsList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData("/publication");
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IPublication[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPublication, setEditingPublication] =
    useState<IPublication | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { fetchedData: featuredImages } = useFetchData("/imageupload");

  const [subCategories, setSubCategories] = useState<{
    [key: number]: ISubCategory[];
  }>({});

  useEffect(() => {
    // Fetch publications data
    if (fetchedData && fetchedData.success) {
      setFilteredData(fetchedData.data.data);
    }

    // Fetch categories
    axiosInstance
      .get("/category") // Adjust the endpoint as necessary
      .then((response) => {
        setCategories(response.data.data.result);
        // Initialize subCategories mapping
        const initialSubCategories: { [key: number]: ISubCategory[] } = {};
        response.data.data.result.forEach((category: ICategory) => {
          initialSubCategories[category.id] = category.subCategories || [];
        });
        setSubCategories(initialSubCategories);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  }, [fetchedData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = fetchedData.data.data.filter((publication: IPublication) =>
      publication.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEditClick = (publication: IPublication) => {
    setEditingPublication(publication);
    form.setFieldsValue({
      title: publication.title,
      subTitle: publication.subTitle,
      description: publication.description,
      category: publication.category.id,
      subCategory: publication.subCategory ? publication.subCategory.id : null,
      featuredImage: publication.featuredImage
        ? publication.featuredImage.id
        : null,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingPublication) {
        axiosInstance
          .patch(`/publication/${editingPublication.id}`, {
            title: values.title,
            subTitle: values.subTitle,
            description: values.description,
            category: values.category,
            subCategory: values.subCategory,
            featuredImage: values.featuredImage,
          })
          .then(() => {
            message.success("प्रकाशन सफलतापूर्वक अपडेट गरियो!");
            setIsEditModalVisible(false);
            // Update the local state to reflect the changes
            setFilteredData((prevData) =>
              prevData.map((publication) =>
                publication.id === editingPublication.id
                  ? { ...publication, ...values }
                  : publication
              )
            );
            refetchData();
          })
          .catch((error) => {
            message.error("प्रकाशन अपडेट गर्न असफल भयो।");
            console.error("Error updating publication:", error);
          });
      }
    });
  };

  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/publication/${id}`)
      .then(() => {
        message.success("प्रकाशन सफलतापूर्वक हटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("प्रकाशन हटाउन असफल भयो।");
        console.error("Error deleting publication:", error);
      });
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
      width: 50,
    },
    {
      title: "शीर्षक",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "उपशीर्षक",
      dataIndex: "subTitle",
      key: "subTitle",
      width: 150,
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
      render: (text: any) => (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className="line-clamp-3"
        />
      ),
      width: 200,
    },
    {
      title: "विशेष छवि",
      dataIndex: "featuredImage",
      key: "featuredImage",
      render: (text: any) =>
        text ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${text.image}`}
            alt="विशेष"
            width={250}
            height={250}
          />
        ) : (
          "उपलब्ध छैन"
        ),
      width: 150,
    },
    {
      title: "वर्ग",
      dataIndex: ["category", "name"],
      key: "category",
      width: 150,
    },
    {
      title: "उप वर्ग",
      dataIndex: ["subCategory", "name"],
      key: "subCategory",
      width: 150,
    },
    {
      title: "कार्रवाई",
      key: "action",
      render: (text: any, record: IPublication) => (
        <div className="grid grid-cols-2 px-2 border rounded-lg divide-x-2">
          <div className="flex justify-center py-2">
            <button onClick={() => handleEditClick(record)}>
              <FaEdit className="text-gray-700" />
            </button>
          </div>
          <div className="flex justify-center py-2">
            <button onClick={() => handleDelete(record.id)}>
              <FaTrash className="text-red-500" />
            </button>
          </div>
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <section>
      <h1 className="text-xl lg:text-2xl font-medium mb-4">प्रकाशन सूची</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="शीर्षक द्वारा खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <AddPublicationModal refetchData={refetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="प्रकाशन सम्पादन गर्नुहोस्"
        open={isEditModalVisible}
        width={1000}
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
        <Form form={form} layout="vertical" className="grid grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label="शीर्षक"
            rules={[{ required: true, message: "कृपया शीर्षक भर्नुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subTitle"
            label="उपशीर्षक"
            rules={[{ required: true, message: "कृपया उपशीर्षक भर्नुहोस्" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="वर्ग"
            rules={[{ required: true, message: "कृपया एक वर्ग चयन गर्नुहोस्" }]}
          >
            <Select
              placeholder="वर्ग चयन गर्नुहोस्"
              onChange={(value) => {
                const selectedCategory = categories.find(
                  (category) => category.id === value
                );
                if (selectedCategory && selectedCategory.subCategories) {
                  setSubCategories((prev) => ({
                    ...prev,
                    [value]: selectedCategory.subCategories,
                  }));
                }
              }}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="उप वर्ग">
            <Select placeholder="उप वर्ग चयन गर्नुहोस्">
              {subCategories[form.getFieldValue("category")]?.map(
                (subCategory) => (
                  <Select.Option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="विवरण"
            rules={[{ required: true, message: "कृपया विवरण भर्नुहोस्" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="featuredImage"
            label="विशेष छवि"
            rules={[
              { required: true, message: "कृपया विशेष छवि चयन गर्नुहोस्" },
            ]}
          >
            <Select placeholder="विशेष छवि चयन गर्नुहोस्">
              {featuredImages?.data?.result?.map((image: any) => (
                <Select.Option key={image.id} value={image.id}>
                  {image?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default PublicationsList;
