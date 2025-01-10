import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { ICategory, IImage, ISubCategory } from "@/utils/interface";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import Image from "next/image";
import { useEffect, useState } from "react";

const { Option } = Select;

interface AddPublicationModalProps {
  refetchData: () => void;
}

interface SubCategoryOption {
  label: string;
  value: number;
  category: number;
}

const AddPublicationModal = ({ refetchData }: AddPublicationModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageOptions, setImageOptions] = useState<
    { label: string; value: number; image: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<
    SubCategoryOption[]
  >([]);

  // Fetch images data for Select options
  const { fetchedData: imagesData } = useFetchData("/imageupload");

  // Fetch categories and subcategories data for Select options
  const { fetchedData: categoriesData } = useFetchData("/category");

  useEffect(() => {
    if (imagesData && imagesData.success) {
      setImageOptions(
        imagesData.data.result.map((img: IImage) => ({
          label: img.name,
          value: img.id,
          image: img.image,
        }))
      );
    }
  }, [imagesData]);

  useEffect(() => {
    if (categoriesData && categoriesData.success) {
      // Flatten categories
      const categories = categoriesData.data.result.map(
        (category: ICategory) => ({
          label: category.name,
          value: category.id,
        })
      );
      setCategoryOptions(categories);

      // Flatten subcategories and include category ID
      const subCategories: SubCategoryOption[] =
        categoriesData.data.result.flatMap((category: ICategory) =>
          category.subCategories.map((subCategory: ISubCategory) => ({
            label: subCategory.name,
            value: subCategory.id,
            category: category.id,
          }))
        );
      setSubCategoryOptions(subCategories);
    }
  }, [categoriesData]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const {
        title,
        subTitle,
        description,
        category,
        subCategory,
        featuredImage,
      } = values;
      axiosInstance
        .post("/publication", {
          title,
          subTitle,
          description,
          category,
          subCategory,
          featuredImage: featuredImage,
        })
        .then(() => {
          message.success("प्रकाशन सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("प्रकाशन थप्न असफल भयो।");
          console.error("Error adding publication:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
    form.resetFields();
  };

  const handleCategoryChange = (categoryId: number) => {
    // Filter subcategories based on selected category
    const filteredSubCategories = subCategoryOptions.filter(
      (subCategory) => subCategory.category === categoryId
    );
    form.setFieldsValue({ subCategory: undefined }); // Reset subCategory
    setSubCategoryOptions(filteredSubCategories);
  };

  return (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => setIsVisible(true)}
      >
        नयाँ प्रकाशन थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ प्रकाशन थप्नुहोस्"
        visible={isVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="grid lg:grid-cols-2 gap-4"
        >
          <Form.Item
            label="शीर्षक"
            name="title"
            rules={[
              { required: true, message: "कृपया प्रकाशनको शीर्षक भर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="उपशीर्षक"
            name="subTitle"
            rules={[
              {
                required: true,
                message: "कृपया प्रकाशनको उपशीर्षक भर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="वर्ग"
            name="category"
            rules={[{ required: true, message: "कृपया एक वर्ग चयन गर्नुहोस्" }]}
          >
            <Select
              placeholder="एक वर्ग चयन गर्नुहोस्"
              onChange={handleCategoryChange}
            >
              {categoryOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="उप वर्ग"
            name="subCategory"
            rules={[
              { required: true, message: "कृपया एक उप वर्ग चयन गर्नुहोस्" },
            ]}
          >
            <Select placeholder="एक उप वर्ग चयन गर्नुहोस्">
              {subCategoryOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="विशेष छवि"
            name="featuredImage"
            rules={[{ required: true, message: "कृपया छवि चयन गर्नुहोस्" }]}
          >
            <Select placeholder="छवि चयन गर्नुहोस्">
              {imageOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${option.image}`}
                      alt={option.label}
                      width={40}
                      height={40}
                      className="mr-2 rounded"
                    />
                    <span>{option.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="विवरण"
            name="description"
            className="col-span-2"
            rules={[
              {
                required: true,
                message: "कृपया प्रकाशनको विवरण भर्नुहोस्",
              },
            ]}
          >
            <Input.TextArea rows={12} className="resize-none" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              सुरक्षित गर्नुहोस्
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddPublicationModal;
