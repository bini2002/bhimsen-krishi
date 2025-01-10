/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Input, Form, Switch, message } from "antd/lib";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage, ICategory } from "@/utils/interface";
import useFetchData from "@/hook/useFetchData";

interface IAddSubCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  refetchData: () => void;
}

const AddSubCategoryModal: React.FC<IAddSubCategoryModalProps> = ({
  visible,
  onClose,
  refetchData,
}) => {
  const { Option } = Select;
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const { fetchedData: categoriesData } = useFetchData("/category");

  const [images, setImages] = useState<IImage[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (imagesData?.success && imagesData?.data) {
      setImages(imagesData?.data?.result);
    }
  }, [imagesData]);

  useEffect(() => {
    if (categoriesData?.success && categoriesData?.data) {
      setCategories(categoriesData?.data?.result);
    }
  }, [categoriesData]);

  const handleAddSubCategory = async (values: any) => {
    setLoading(true);
    try {
      await axiosInstance.post("/subcategory", values);
      message.success("उप-श्रेणी सफलतापूर्वक थपिएको छ।");
      refetchData(); // Refetch the subcategories list after adding a new one
      onClose();
      form.resetFields();
    } catch (error) {
      message.error("उप-श्रेणी थप्नमा समस्या आयो।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="नयाँ उप-श्रेणी थप्नुहोस्"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          रद्द गर्नुहोस्
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          थप्नुहोस्
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleAddSubCategory}>
        <Form.Item
          name="name"
          label="उप-श्रेणीको नाम"
          rules={[
            {
              required: true,
              message: "कृपया उप-श्रेणीको नाम प्रविष्ट गर्नुहोस्",
            },
          ]}
        >
          <Input placeholder="उप-श्रेणीको नाम प्रविष्ट गर्नुहोस्" />
        </Form.Item>
        <Form.Item
          name="category"
          label="श्रेणी"
          rules={[{ required: true, message: "कृपया श्रेणी चयन गर्नुहोस्" }]}
        >
          <Select placeholder="श्रेणी चयन गर्नुहोस्">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="प्रकार"
          rules={[{ required: true, message: "कृपया प्रकार चयन गर्नुहोस्" }]}
        >
          <Select placeholder="प्रकार चयन गर्नुहोस्">
            <Option value="PUBLICATION">प्रकाशन</Option>
            <Option value="MARKETPLACE">बजार स्थान</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isActive"
          label="स्थिति"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="सक्रिय" unCheckedChildren="निष्क्रिय" />
        </Form.Item>
        <Form.Item name="image" label="तस्विर">
          <Select placeholder="तस्विर चयन गर्नुहोस्">
            {images.map((img) => (
              <Option key={img.id} value={img.id}>
                {img.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSubCategoryModal;
