import React, { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import { ICategory, ISubCategory, IImage } from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";
import Image from "next/image";
import useFetchData from "@/hook/useFetchData";

interface AddNewsModalProps {
  refetchData: () => void;
}

const AddNewsModal: React.FC<AddNewsModalProps> = ({ refetchData }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

  const { fetchedData: categories, loading: loadingCategories } =
    useFetchData("/category");
  const { fetchedData: featuredImages, loading: loadingFeaturedImages } =
    useFetchData("/imageupload");

  const handleSave = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        image: values.image,
        categories: values.categories,
        subCategories: values.subCategories,
      };

      const response = await axiosInstance.post("/news", payload);


      if (response.status === 200 || response.status === 201) {
        message.success("समाचार सफलतापूर्वक थपिएको छ!");
        handleClose();
        await refetchData(); // Wait for refetchData to complete
      } else {
        throw new Error("समाचार थप्न असफल");
      }
    } catch (error) {
      message.error("समाचार थप्न असफल।");
      console.error("समाचार थप्ने क्रममा त्रुटि:", error);
    }
  };

  const handleFinish = (values: any) => {
    handleSave(values);
  };

  const handleClose = () => {
    form.resetFields();
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCategoryChange = (value: number[]) => {
    const selectedSubCategories =
      categories?.data?.result
        .filter((cat: ICategory) => value.includes(cat.id))
        .flatMap((cat: ICategory) => cat.subCategories) || [];
    setSubCategories(selectedSubCategories);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        समाचार थप्नुहोस्
      </Button>
      <Modal
        title="समाचार थप्नुहोस्"
        visible={visible}
        onCancel={handleClose}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={form.submit}>
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
            rules={[
              {
                required: true,
                message: "कृपया समाचारको शीर्षक प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="image" label="विशेष चित्र">
            <Select placeholder="विशेष चित्र चयन गर्नुहोस्">
              {featuredImages?.data?.result.map((image: IImage) => (
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
              {
                required: true,
                message: "कृपया कम्तिमा एक श्रेणी चयन गर्नुहोस्",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="श्रेणीहरू चयन गर्नुहोस्"
              onChange={handleCategoryChange}
            >
              {categories?.data?.result.map((cat: ICategory) => (
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
              {subCategories.map((subCat: ISubCategory) => (
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
              {
                required: true,
                message: "कृपया समाचारको विवरण प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input.TextArea rows={12} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewsModal;
