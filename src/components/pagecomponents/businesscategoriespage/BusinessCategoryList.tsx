import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Checkbox, Form, Input, Modal, Table, message } from "antd/lib";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";

interface IBusinessCategory {
  id: number;
  name: string;
  isActive: boolean;
}

const BusinessCategoryList: React.FC = () => {
  const [businessCategories, setBusinessCategories] = useState<
    IBusinessCategory[]
  >([]);
  const [filteredCategories, setFilteredCategories] = useState<
    IBusinessCategory[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<IBusinessCategory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  const { fetchedData, refetchData } = useFetchData("/business-model-category");

  useEffect(() => {
    if (fetchedData?.data?.data) {
      setBusinessCategories(fetchedData.data.data);
      setFilteredCategories(fetchedData.data.data);
    }
  }, [fetchedData]);

  const handleSearch = debounce((value: string) => {
    setFilteredCategories(
      businessCategories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, 300);

  const openModal = (category?: IBusinessCategory) => {
    setEditingCategory(category || null);
    setIsAddMode(!category);
    setIsModalVisible(true);

    // Reset the form values when opening the modal
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  };

  const handleSaveCategory = async (values: Partial<IBusinessCategory>) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await axiosInstance.patch(
          `/business-model-category/${editingCategory.id}`,
          values
        );
        message.success("व्यवसाय वर्ग सफलतापूर्वक अद्यावधिक गरियो।");
      } else {
        const response = await axiosInstance.post(
          "/business-model-category",
          values
        );
        setFilteredCategories([...filteredCategories, response.data.data]);
        message.success("व्यवसाय वर्ग सफलतापूर्वक थपियो।");
      }
      refetchData();
      setIsModalVisible(false);
    } catch {
      message.error(
        `व्यवसाय वर्ग ${editingCategory ? "अद्यावधिक" : "थप्न"} मा त्रुटि।`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "तपाईं निश्चित रूपमा यो व्यवसाय वर्ग मेटाउन चाहनुहुन्छ?",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/business-model-category/${id}`);
          message.success("व्यवसाय वर्ग मेटाइयो।");
          setFilteredCategories(
            filteredCategories.filter((cat) => cat.id !== id)
          );
          refetchData();
        } catch {
          message.error("व्यवसाय वर्ग मेटाउन त्रुटि।");
        }
      },
    });
  };

  const columns = [
    { title: "नाम", dataIndex: "name", key: "name" },
    {
      title: "क्रियाहरू",
      key: "actions",
      render: (_: any, record: IBusinessCategory) => (
        <>
          <div className="flex space-x-2">
            <Button onClick={() => openModal(record)} icon={<FaEdit />} />
            <Button
              onClick={() => handleDelete(record.id)}
              danger
              icon={<FaTrash />}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="व्यवसाय वर्गहरू खोज्नुहोस्"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-2/3"
        />
        <Button type="primary" onClick={() => openModal()}>
          वर्ग थप्नुहोस्
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        loading={loading}
        rowKey="id"
      />

      <Modal
        open={isModalVisible}
        title={`${isAddMode ? "थप्नुहोस्" : "सम्पादन गर्नुहोस्"} व्यवसाय वर्ग`}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          id="categoryForm"
          initialValues={editingCategory || { name: "", isActive: true }}
          onFinish={handleSaveCategory}
          onFinishFailed={() => message.error("कृपया फारम पूरा गर्नुहोस्!")}
        >
          <Form.Item
            name="name"
            label="वर्ग नाम"
            rules={[
              { required: true, message: "कृपया वर्ग नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>सक्रिय</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isAddMode ? "थप्नुहोस्" : "अद्यावधिक गर्नुहोस्"} वर्ग
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessCategoryList;
