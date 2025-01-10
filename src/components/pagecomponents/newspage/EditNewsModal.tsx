import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import {
  ICategory,
  IFeaturedImage,
  INews,
  ISubCategory,
} from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";
import Image from "next/image";
import useFetchData from "@/hook/useFetchData";

interface EditNewsModalProps {
  visible: boolean;
  onClose: () => void;
  newsItem: INews;
  refetchData: () => void;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  visible,
  onClose,
  newsItem,
  refetchData,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [featuredImages, setFeaturedImages] = useState<IFeaturedImage[]>([]);

  // श्रेणी र प्रमुख छविहरू ल्याउनुहोस्
  const { fetchedData: fetchedCategories } = useFetchData("/category");
  const { fetchedData: fetchedImages } = useFetchData("/imageupload");

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories.data.result);
    }
    if (fetchedImages) {
      setFeaturedImages(fetchedImages.data.result);
    }
  }, [fetchedCategories, fetchedImages]);

  useEffect(() => {
    if (newsItem) {
      form.setFieldsValue({
        title: newsItem.title,
        description: newsItem.description,
        image: newsItem.image.id,
        categories: newsItem.categories.map((category) => category.id),
        subCategories: newsItem.subCategories.map(
          (subCategory) => subCategory.id
        ),
      });
      // चयनित श्रेणीको आधारमा उपश्रेणी अद्यावधिक गर्नुहोस्
      handleCategoryChange(newsItem.categories.map((category) => category.id));
    }
  }, [newsItem, form]);

  const handleSave = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        image: values.image,
        categories: values.categories,
        subCategories: values.subCategories,
      };
      const response = await axiosInstance.patch(
        `/news/${newsItem.id}`,
        payload
      );

      if (response.status !== 200) {
        throw new Error("समाचार अद्यावधिक गर्न असफल");
      }

      message.success("समाचार सफलतापूर्वक अद्यावधिक गरियो!");
      onClose();
      refetchData();
    } catch (error) {
      message.error("समाचार अद्यावधिक गर्न असफल।");
      console.error("समाचार अद्यावधिक गर्ने क्रममा त्रुटि:", error);
    }
  };

  const handleFinish = (values: any) => {
    handleSave(values);
  };

  const handleCategoryChange = (value: number[]) => {
    const selectedSubCategories = categories
      .filter((cat) => value.includes(cat.id))
      .flatMap((cat) => cat.subCategories);
    setSubCategories(selectedSubCategories);
  };

  return (
    <Modal
      title="समाचार सम्पादन गर्नुहोस्"
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          रद्द गर्नुहोस्
        </Button>,
        <Button key="save" type="primary" onClick={() => form.submit()}>
          सुरक्षित गर्नुहोस्
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="grid lg:grid-cols-2 gap-4"
      >
        <Form.Item
          name="title"
          label="शीर्षक"
          rules={[{ required: true, message: "कृपया समाचारको शीर्षक प्रविष्ट गर्नुहोस्" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="image" label="विशेष छवि">
          <Select placeholder="विशेष छवि चयन गर्नुहोस्">
            {featuredImages.map((image) => (
              <Select.Option key={image.id} value={image.id}>
                <div className="flex items-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${image.image}`}
                    alt={image.name}
                    width={50}
                    height={50}
                    className="mr-2"
                  />
                  {image.name}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="categories"
          label="श्रेणीहरू"
          rules={[
            { required: true, message: "कृपया कम्तिमा एक श्रेणी चयन गर्नुहोस्" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="श्रेणीहरू चयन गर्नुहोस्"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="subCategories"
          label="उप श्रेणीहरू"
          rules={[
            {
              required: true,
              message: "कृपया कम्तिमा एक उपश्रेणी चयन गर्नुहोस्",
            },
          ]}
        >
          <Select mode="multiple" placeholder="उप श्रेणीहरू चयन गर्नुहोस्">
            {subCategories.map((subCat) => (
              <Select.Option key={subCat.id} value={subCat.id}>
                {subCat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="विवरण"
          className="col-span-2"
          rules={[
            { required: true, message: "कृपया समाचारको विवरण प्रविष्ट गर्नुहोस्" },
          ]}
        >
          <Input.TextArea rows={12} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditNewsModal;