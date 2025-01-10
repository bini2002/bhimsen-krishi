import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Divider } from "antd/lib";
import useFetchData from "@/hook/useFetchData";
import { IImage } from "@/utils/interface";
import { axiosInstance } from "@/utils/axiosInstance";

const { Option } = Select;

interface SubCategory {
  name: string;
  image: number | null;
  type: string;
}

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  refetchData: () => void;
}

export default function AddCategoryModal({
  visible,
  onClose,
  refetchData,
}: AddCategoryModalProps) {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    {
      name: "",
      image: null,
      type: "MARKETPLACE",
    },
  ]);
  const { fetchedData: images } = useFetchData("/imageupload");

  const handleAddSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
      { name: "", image: null, type: "MARKETPLACE" },
    ]);
  };

  const handleRemoveSubCategory = (index: number) => {
    setSubCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: any) => {
    const categoryData = {
      name: values.name,
      subCategories: subCategories,
    };

    try {
      const response = await axiosInstance.post("/category", categoryData);
      message.success("Category added successfully!");
      refetchData();
      onClose();
    } catch (error) {
      console.error("Error adding category: ", error);
      message.error("Failed to add category. Please try again.");
    }
  };

  return (
    <Modal
      title="Add Category"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the category name" },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <h2 className="font-medium ">Subcategories</h2>
        <hr className="my-4" />

        <Form.List name="subCategories">
          {(fields, { add, remove }) => (
            <>
              {subCategories.map((subCategory, index) => (
                <div key={index}>
                  <Form.Item
                    label={`Subcategory Name ${index + 1}`}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the subcategory name",
                      },
                    ]}
                  >
                    <Input
                      value={subCategory.name}
                      onChange={(e) => {
                        const updatedSubCategories = [...subCategories];
                        updatedSubCategories[index].name = e.target.value;
                        setSubCategories(updatedSubCategories);
                      }}
                      placeholder="Enter subcategory name"
                    />
                  </Form.Item>

                  <Form.Item label={`Select Image ${index + 1}`}>
                    <Select
                      value={subCategory.image || undefined}
                      onChange={(value) => {
                        const updatedSubCategories = [...subCategories];
                        updatedSubCategories[index].image = value;
                        setSubCategories(updatedSubCategories);
                      }}
                      style={{ width: "100%" }}
                      placeholder="Select an image"
                    >
                      {images?.data?.result?.map((image: IImage) => (
                        <Option key={image.id} value={image.id}>
                          {image.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label={`Type ${index + 1}`}>
                    <Select
                      value={subCategory.type}
                      onChange={(value) => {
                        const updatedSubCategories = [...subCategories];
                        updatedSubCategories[index].type = value;
                        setSubCategories(updatedSubCategories);
                      }}
                      style={{ width: 200 }}
                    >
                      <Option value="PUBLICATION">Publication</Option>
                      <Option value="MARKETPLACE">Marketplace</Option>
                    </Select>
                  </Form.Item>

                  <Button
                    type="link"
                    className="border border-red-500 text-red-500 max-w-[8rem]"
                    onClick={() => handleRemoveSubCategory(index)}
                  >
                    Remove
                  </Button>

                  {/* Divider to separate each subcategory */}
                  {index < subCategories.length - 1 && <Divider />}
                </div>
              ))}
              <div className="flex max-w-[8rem] mt-4">
                <Button
                  type="dashed"
                  onClick={handleAddSubCategory}
                  block
                  className="w-auto"
                >
                  + Add
                </Button>
              </div>
            </>
          )}
        </Form.List>

        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" block>
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
