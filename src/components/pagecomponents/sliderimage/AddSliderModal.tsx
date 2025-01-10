import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import { useEffect, useState } from "react";
import { ISlider, IImage } from "@/utils/interface";
import Image from "next/image";
import useFetchData from "@/hook/useFetchData";

const { Option } = Select;

interface AddSlideModalProps {
  refetchData: () => void;
}

const AddSlideModal = ({ refetchData }: AddSlideModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageOptions, setImageOptions] = useState<
    { label: string; value: number; image: string }[]
  >([]);

  // Select का लागि छविहरू डेटा ल्याउनुहोस्
  const { fetchedData: imagesData } = useFetchData("/imageupload");

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

  const handleSave = () => {
    form.validateFields().then((values) => {
      const data = {
        title: values.title,
        description: values.description,
        featuredImage: values.featuredImage,
      };

      axiosInstance
        .post("/slider", data)
        .then(() => {
          message.success("स्लाइड सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("स्लाइड थप्न असफल।");
          console.error("स्लाइड थप्ने त्रुटि:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => setIsVisible(true)}
      >
        नयाँ स्लाइड थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ स्लाइड थप्नुहोस्"
        visible={isVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="शीर्षक"
            name="title"
            rules={[
              { required: true, message: "कृपया स्लाइड शीर्षक प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="वर्णन"
            name="description"
            rules={[
              { required: true, message: "कृपया स्लाइड वर्णन प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
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
                      width={32}
                      height={32}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
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

export default AddSlideModal;