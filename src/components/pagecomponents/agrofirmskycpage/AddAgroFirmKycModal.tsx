/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd/lib";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface AddAgroFirmKYCModalProps {
  refetchData: () => void;
}

const AddAgroFirmKYCModal = ({ refetchData }: AddAgroFirmKYCModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const { data } = useSession();

  // Fetch images
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      axiosInstance
        .post(
          "/kyc/agrofirm",
          {
            ...values,
            images: selectedImages, // Use the selected images
          },
          {
            headers: {
              Authorization: `Bearer ${data?.user?.accessToken}`,
            },
          }
        )
        .then(() => {
          message.success("एग्रो फर्म KYC सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          setSelectedImages([]);
          refetchData();
        })
        .catch((error) => {
          message.error("एग्रो फर्म KYC थप्न असफल!");
          console.error("Error adding Agro Firm KYC:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => setIsVisible(true)}
      >
        एग्रो फर्म KYC थप्नुहोस्
      </Button>
      <Modal
        title="एग्रो फर्म KYC थप्नुहोस्"
        visible={isVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            सुरक्षित गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firmName"
            label="फर्मको नाम"
            rules={[
              { required: true, message: "फर्मको नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ward"
            label="वडा"
            rules={[
              { required: true, message: "वडा संख्या प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="address"
            label="ठेगाना"
            rules={[{ required: true, message: "ठेगाना प्रविष्ट गर्नुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pan"
            label="PAN"
            rules={[{ required: true, message: "PAN प्रविष्ट गर्नुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="annualInvestment"
            label="वार्षिक लगानी"
            rules={[
              { required: true, message: "वार्षिक लगानी प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="annualTransaction"
            label="वार्षिक कारोबार"
            rules={[
              { required: true, message: "वार्षिक कारोबार प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="personalExpenses"
            label="व्यक्तिगत खर्च"
            rules={[
              { required: true, message: "व्यक्तिगत खर्च प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="fullTimeEmpoloyees"
            label="पूर्णकालीन कर्मचारी"
            rules={[
              {
                required: true,
                message: "पूर्णकालीन कर्मचारीको संख्या प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="parTimeEmployees"
            label="अंशकालीन कर्मचारी"
            rules={[
              {
                required: true,
                message: "अंशकालीन कर्मचारीको संख्या प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          {/* Updated Whom They Sell with Form.List */}
          <Form.Item label="कसलाई बिक्री गरिन्छ">
            <Form.List name="whomeTheySell">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key ?? name} className="flex items-center mb-2">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[
                          { required: true, message: "मान प्रविष्ट गर्नुहोस्" },
                        ]}
                        style={{ width: "80%" }}
                      >
                        <Input placeholder="नाम प्रविष्ट गर्नुहोस्" />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        onClick={() => remove(name)}
                        style={{ marginLeft: "8px" }}
                      >
                        हटाउनुहोस्
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                  >
                    थप्नुहोस्
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            name="type"
            label="प्रकार"
            rules={[{ required: true, message: "प्रकार चयन गर्नुहोस्" }]}
          >
            <Select placeholder="प्रकार चयन गर्नुहोस्">
              <Select.Option value="BUSINESS">व्यापार</Select.Option>
              <Select.Option value="GROUP">समूह</Select.Option>
              <Select.Option value="CO-OPERATIVE">सहकारी</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="तस्बिरहरू"
            rules={[{ required: true, message: "तस्बिरहरू चयन गर्नुहोस्" }]}
          >
            <Select
              mode="multiple"
              placeholder="तस्बिरहरू चयन गर्नुहोस्"
              onChange={setSelectedImages}
            >
              {imagesData?.data?.result?.length ? (
                imagesData.data.result.map(
                  (image: { id: number; image: string }) => (
                    <Select.Option key={image.id} value={image.id}>
                      <div className="flex items-center">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${image.image}`}
                          alt={`Image ${image.id}`}
                          className="mr-2"
                          width={50}
                          height={50}
                          onError={(e) => {
                            // Handle image load error
                            e.currentTarget.src = "/fallback-image.png"; // Fallback image
                          }}
                        />
                        {image.id}
                      </div>
                    </Select.Option>
                  )
                )
              ) : (
                <Select.Option disabled>No images available</Select.Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAgroFirmKYCModal;
