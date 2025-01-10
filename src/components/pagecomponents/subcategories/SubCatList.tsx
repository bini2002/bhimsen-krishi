/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage } from "@/utils/interface";
import {
  Button,
  Modal,
  Select,
  Spin,
  Table,
  message,
  Input,
  Form,
  Switch,
} from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import AddSubCategoryModal from "./AddSubCatModal";

interface ISubCategory {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  category: number;
  type: string;
  image: number | null;
}

const SubCatList: React.FC = () => {
  const { Option } = Select;
  const { fetchedData, refetchData } = useFetchData("/subcategory");
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const { fetchedData: categoriesData } = useFetchData("/category"); // Fetch categories

  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [images, setImages] = useState<IImage[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // To store categories data
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<ISubCategory | null>(null);
  const [form] = Form.useForm();

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const showModal = () => {
    setAddModalVisible(true);
  };

  const handleClose = () => {
    setAddModalVisible(false);
  };

  useEffect(() => {
    if (fetchedData?.success && fetchedData.data.data) {
      setSubCategories(fetchedData.data.data);
    }
    if (imagesData?.success && imagesData?.data) {
      setImages(imagesData?.data?.result);
    }
    if (categoriesData?.success && categoriesData?.data) {
      setCategories(categoriesData?.data?.result); // Set categories data
    }
    setLoading(false);
  }, [fetchedData, imagesData, categoriesData]);

  const handleDeleteSubCategory = async (id: number) => {
    Modal.confirm({
      title: "के तपाईँ यो उप-श्रेणी मेट्न चाहानुहुन्छ?",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/subcategory/${id}`);
          message.success("उप-श्रेणी सफलतापूर्वक मेटिएको छ।");
          refetchData();
        } catch (error) {
          message.error("उप-श्रेणी मेट्नमा समस्या आयो।");
        }
      },
    });
  };

  const handleEditSubCategory = (subCategory: ISubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsModalVisible(true);
    form.setFieldsValue(subCategory);
  };

  const handleEditSubmit = async (values: ISubCategory) => {
    try {
      await axiosInstance.patch(
        `/subcategory/${selectedSubCategory?.id}`,
        values
      );
      message.success("उप-श्रेणी सफलतापूर्वक सम्पादन गरियो।");
      refetchData();
      setIsModalVisible(false);
    } catch (error) {
      message.error("उप-श्रेणी सम्पादन गर्नमा समस्या आयो।");
    }
  };

  const getImageUrl = (imageId: number | null) => {
    const image = images.find((img) => img.id === imageId);
    return image ? `${process.env.NEXT_PUBLIC_API_URL}/${image.image}` : null;
  };

  const columns = [
    {
      title: "उप-श्रेणीको नाम",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "स्थिति",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "सक्रिय" : "निष्क्रिय"),
    },
    {
      title: "प्रकार",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "तस्विर",
      dataIndex: "image",
      key: "image",
      render: (imageId: number | null) =>
        imageId ? (
          <Image
            src={getImageUrl(imageId) || ""}
            alt="sub-category image"
            className="rounded-md w-24 h-16 object-cover"
            width={100}
            height={100}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "क्रिया",
      key: "action",
      render: (_: any, subCategory: ISubCategory) => (
        <>
          <Button
            onClick={() => handleEditSubCategory(subCategory)}
            className="hover:bg-blue-600 transition duration-300 ease-in-out mr-2"
            icon={<AiOutlineEdit />}
          />
          <Button
            onClick={() => handleDeleteSubCategory(subCategory.id)}
            className="hover:bg-red-600 transition duration-300 ease-in-out"
            icon={<AiOutlineDelete />}
          />
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold mb-4">उप-श्रेणीहरू</h1>
        <div className="flex ">
          <Button type="primary" className="" onClick={showModal}>
            Add SubCategory
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="लोड हुँदैछ..." />
        </div>
      ) : (
        <Table
          dataSource={subCategories}
          columns={columns}
          rowKey="id"
          pagination={false}
          rowClassName="hover:bg-gray-100 transition duration-300 ease-in-out"
        />
      )}

      {/* Edit SubCategory Modal */}
      <Modal
        title="उप-श्रेणी सम्पादन गर्नुहोस्"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            सम्पादन गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="उप-श्रेणीको नाम">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="प्रकार">
            <Select>
              <Option value="PUBLICATION">प्रकाशन</Option>
              <Option value="MARKETPLACE">बजार स्थान</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="श्रेणी">
            <Select placeholder="श्रेणी चयन गर्नुहोस्">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="स्थिति" valuePropName="checked">
            <Switch checkedChildren="सक्रिय" unCheckedChildren="निष्क्रिय" />
          </Form.Item>
          <Form.Item name="image" label="तस्विर">
            <Select placeholder="Choose an image">
              {images.map((img) => (
                <Option key={img.id} value={img.id}>
                  {img.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add SubCategory Modal */}
      <AddSubCategoryModal
        onClose={handleClose}
        visible={isAddModalVisible}
        refetchData={refetchData}
      />
    </div>
  );
};

export default SubCatList;
