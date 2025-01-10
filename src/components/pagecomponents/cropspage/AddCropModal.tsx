/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { IImage } from "@/utils/interface";
import { Button, Form, Input, Modal, Select, message } from "antd/lib";
import Image from "next/image";
import React, { useState } from "react";

const { Option } = Select;

interface AddCropModalProps {
  refetchData: () => void;
}

const AddCropModal = ({ refetchData }: AddCropModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);

  const { fetchedData: types, loading: loadingTypes } = useFetchData(
    "/crop-calendar/crop-type"
  );
  const { fetchedData: seasons, loading: loadingSeasons } = useFetchData(
    "/crop-calendar/season"
  );
  const { fetchedData: images, loading: loadingImages } =
    useFetchData("/imageupload");

  const handleSave = () => {
    form.validateFields().then((values) => {
      axiosInstance
        .post("/crop-calendar/crop-calendar", {
          cropName: values.cropName,
          image: values.imageId,
          types: values.types,
          seasons: values.seasons,
          description: values.description,
        })
        .then((response) => {
          message.success("बाली सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          setFile(null);
          refetchData();
        })
        .catch((error) => {
          message.error("बाली थप्न असफल भयो।");
          console.error("Error adding crop:", error);
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
        नयाँ बाली थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ बाली थप्नुहोस्"
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
            name="cropName"
            label="बालीको नाम"
            rules={[{ required: true, message: "कृपया बालीको नाम लेख्नुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imageId"
            label="छवि"
            rules={[{ required: true, message: "कृपया एक छवि छान्नुहोस्" }]}
          >
            <Select placeholder="छवि छान्नुहोस्" loading={loadingImages}>
              {images?.data?.result?.map((image: IImage) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${image?.image}`;
                return (
                  <Option key={image.id} value={image.id}>
                    <div className="flex gap-3 items-center">
                      <Image src={imageUrl} alt="बाली" width={28} height={28} />
                      <span>{`${image?.name}`}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="types"
            label="प्रकार"
            rules={[
              { required: true, message: "कृपया कम्तीमा एक प्रकार छान्नुहोस्" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="प्रकार छान्नुहोस्"
              loading={loadingTypes}
            >
              {types?.data?.data?.map((type: any) => (
                <Option key={type.id} value={type.id}>
                  {type.type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="seasons"
            label="मौसमहरू"
            rules={[
              { required: true, message: "कृपया कम्तीमा एक मौसम छान्नुहोस्" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="मौसमहरू छान्नुहोस्"
              loading={loadingSeasons}
            >
              {seasons?.data?.result?.map((season: any) => (
                <Option key={season.id} value={season.id}>
                  {season.seasonName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="विवरण"
            rules={[{ required: true, message: "कृपया विवरण लेख्नुहोस्" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCropModal;
