/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage } from "@/utils/interface";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import Image from "next/image";
import React, { useState } from "react";

const { Option } = Select;

interface AddFertilizerModalProps {
  refetchData: () => void;
}

const AddFertilizerModal = ({ refetchData }: AddFertilizerModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const { fetchedData: images, loading: loadingImages } =
    useFetchData("/imageupload");

  const handleSave = () => {
    form.validateFields().then((values) => {
      axiosInstance
        .post("/fertilizer-calculator/npk", {
          name: values.name,
          nitrogen: Number(values.nitrogen),
          phosphorous: Number(values.phosphorous),
          potassium: Number(values.potassium),
          image: values.imageId,
        })
        .then((response) => {
          message.success("खाद सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("खाद थप्न असफल भयो।");
          console.error("खाद थप्नको त्रुटि:", error);
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
        नयाँ खाद थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ खाद थप्नुहोस्"
        visible={isVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            बचत गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="खादको नाम"
            rules={[
              { required: true, message: "कृपया खादको नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nitrogen"
            label="नाइट्रोजन"
            rules={[
              {
                required: true,
                message: "कृपया नाइट्रोजन मान प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="phosphorous"
            label="फस्फोरस"
            rules={[
              {
                required: true,
                message: "कृपया फस्फोरस मान प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="potassium"
            label="पोटासियम"
            rules={[
              {
                required: true,
                message: "कृपया पोटासियम मान प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="imageId"
            label="छवि"
            rules={[{ required: true, message: "कृपया एक छवि चयन गर्नुहोस्" }]}
          >
            <Select placeholder="छवि चयन गर्नुहोस्" loading={loadingImages}>
              {images?.data?.result?.map((image: IImage) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`;
                return (
                  <Option key={image.id} value={image.id}>
                    <div className="flex gap-3 items-center">
                      <Image src={imageUrl} alt="खाद" width={28} height={28} />
                      <span>{`${image?.name}`}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddFertilizerModal;
