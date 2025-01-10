import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Button,
  Modal,
  message,
  Table,
  Spin,
  Checkbox,
  Select,
} from "antd/lib";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import AddCategoryModal from "./AddCategoryModal";

interface ICategory {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  subCategories: ISubCategory[];
}

interface ISubCategory {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  category: number;
  type: string;
  image: IImage | null;
}

interface IImage {
  id: number;
  createdAt: string;
  isActive: boolean;
  image: string;
  name: string;
}

const CategoriesList: React.FC = () => {
  const { Option } = Select;
  const { fetchedData, refetchData } = useFetchData("/category");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<string>("");

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const showModal = () => {
    setAddModalVisible(true);
  };

  const handleClose = () => {
    setAddModalVisible(false);
  };

  useEffect(() => {
    if (fetchedData?.success && fetchedData.data.result) {
      setCategories(fetchedData.data.result);
    }
    setLoading(false);
  }, [fetchedData]);

  const fetchCategoriesByType = async (type: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/category/findCategoryBySubCategoryType?search=${type}`
      );
      if (response.data.success && response.data.data.result) {
        setCategories(response.data.data.result);
      }
      message.success("श्रेणी सफलतापूर्वक लोड गरियो।");
    } catch (error) {
      message.error("श्रेणी लोड गर्नमा समस्या आयो।");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    Modal.confirm({
      title: "के तपाईँ यो श्रेणी मेट्न चाहानुहुन्छ?",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/category/${id}`);
          message.success("श्रेणी सफलतापूर्वक मेटिएको छ।");
          refetchData();
        } catch (error) {
          message.error("श्रेणी मेट्नमा समस्या आयो।");
        }
      },
    });
  };

  const handleEditCategory = (category: ICategory) => {
    setSelectedCategory(category);
    setSelectedSubCategories([]);
    setIsModalVisible(true);
  };

  const handleSubmitDeletion = async () => {
    if (selectedCategory) {
      try {
        await axiosInstance.patch(`/category/${selectedCategory.id}`, {
          subCategoriesToRemoved: selectedSubCategories,
        });
        message.success("उप-श्रेणीहरू सफलतापूर्वक मेटिएको छ।");
        setIsModalVisible(false);
        refetchData();
      } catch (error) {
        message.error("उप-श्रेणीहरू मेट्नमा समस्या आयो।");
      }
    }
  };

  const columns = [
    {
      title: "श्रेणीको नाम",
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
      title: "उप-श्रेणीहरू",
      dataIndex: "subCategories",
      key: "subCategories",
      render: (subCategories: ISubCategory[]) => (
        <div>
          {subCategories.map((sub) => (
            <p key={sub.id}>{sub.name}</p> // Simple list of subcategory names
          ))}
        </div>
      ),
    },
    {
      title: "क्रिया",
      key: "action",
      render: (_: any, category: ICategory, id: number) => (
        <>
          <Button
            onClick={() => handleEditCategory(category)}
            className="hover:bg-blue-600 transition duration-300 ease-in-out mr-2"
            icon={<AiOutlineEdit />}
          />
          <Button
            onClick={() => handleDeleteCategory(id)}
            className="hover:bg-blue-600 transition duration-300 ease-in-out"
            icon={<AiOutlineDelete />}
          />
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold mb-4">श्रेणीहरू</h1>
        <div className="flex items-center space-x-4">
          <div>
            <Button type="primary" onClick={showModal}>
              Add Category
            </Button>
          </div>
          <div className="flex items-center ">
            <label htmlFor="subCategoryType" className="mr-2">
              Find by SubCategory type:
            </label>
            <Select
              id="subCategoryType"
              value={selectedType}
              onChange={(value) => {
                setSelectedType(value);
                fetchCategoriesByType(value);
              }}
              style={{ width: 200 }}
              placeholder="Select Type"
            >
              <Option value="PUBLICATION">प्रकाशन</Option>
              <Option value="MARKETPLACE">बजार स्थान</Option>
            </Select>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="लोड हुँदैछ..." />
        </div>
      ) : (
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          pagination={false}
          rowClassName="hover:bg-gray-100 transition duration-300 ease-in-out"
        />
      )}

      <AddCategoryModal
        visible={isAddModalVisible}
        onClose={handleClose}
        refetchData={refetchData}
      />

      <Modal
        title="उप-श्रेणीहरू सम्पादन गर्नुहोस्"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitDeletion}>
            मेट्नुहोस्
          </Button>,
        ]}
      >
        <p>तपाईंले यस श्रेणीका उप-श्रेणीहरूलाई मेट्न सक्नुहुन्छ:</p>
        {selectedCategory?.subCategories.map((sub) => (
          <div key={sub.id} className="flex items-center border-b py-2">
            <Checkbox
              checked={selectedSubCategories.includes(sub.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSubCategories([...selectedSubCategories, sub.id]);
                } else {
                  setSelectedSubCategories(
                    selectedSubCategories.filter((id) => id !== sub.id)
                  );
                }
              }}
            >
              {sub.name}
            </Checkbox>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default CategoriesList;
