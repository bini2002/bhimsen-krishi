// src/components/pagecomponents/calendarpage/AddCropForm.tsx

import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { ICropTypesApiResponse, ISeasonsApiResponse } from "@/utils/interface";
import { Button, Form, Input, Select } from "antd/lib";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify

// Define the form field type
type CropFormFields = {
  cropName: string;
  types: number[];
  seasons: number[];
  description: string;
};

const { Option } = Select;

const AddCropForm: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null); // State to store image
  const router = useRouter();

  const { fetchedData: cropTypesData } = useFetchData(
    "/crop-calendar/crop-type"
  );
  const cropTypes: ICropTypesApiResponse = cropTypesData || {
    data: { data: [] },
    message: "",
    status: 200,
  }; // Default values to avoid errors

  const { fetchedData: seasonsData } = useFetchData("/crop-calendar/season");
  const seasons: ISeasonsApiResponse = seasonsData || {
    data: { result: [] },
    message: "",
    status: 200,
  }; // Default values to avoid errors

  const handleFinish = async (values: CropFormFields) => {
    try {
      const formData = new FormData();
      formData.append("cropName", values.cropName);

      // Ensure the image is appended correctly as binary data
      if (image) {
        formData.append("image", image);
      }

      // Append other fields
      formData.append("types", JSON.stringify(values.types));
      formData.append("seasons", JSON.stringify(values.seasons));
      formData.append("description", values.description);

      // Post the form data
      const response = await axiosInstance.post(
        "/crop-calendar/crop-calendar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to add crop");
      }

      toast.success("फसल सफलतापूर्वक थपियो!");
      router.push("/calendar");
    } catch (error) {
      toast.error("फसल थप्नका क्रममा एक त्रुटि भयो।");
      console.error(error);
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <section className="p-4">
      <h1 className="text-xl lg:text-2xl font-medium mb-4">
        नयाँ फसल थप्नुहोस्
      </h1>
      <div className="bg-white p-4 lg:p-8 rounded-xl shadow">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="फसलको नाम"
            name="cropName"
            rules={[
              { required: true, message: "कृपया फसलको नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="तस्बिर"
            name="image"
            rules={[
              { required: true, message: "कृपया एक तस्बिर अपलोड गर्नुहोस्" },
            ]}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="प्रकार"
            name="types"
            rules={[{ required: true, message: "कृपया प्रकार चयन गर्नुहोस्" }]}
          >
            <Select mode="multiple" placeholder="प्रकार चयन गर्नुहोस्">
              {cropTypes?.data?.data.map((type) => (
                <Option key={type?.id} value={type?.id}>
                  {type?.type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="मौसम"
            name="seasons"
            rules={[{ required: true, message: "कृपया मौसम चयन गर्नुहोस्" }]}
          >
            <Select mode="multiple" placeholder="मौसम चयन गर्नुहोस्">
              {seasons?.data?.result?.map((season) => (
                <Option key={season?.id} value={season?.id}>
                  {season?.seasonName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="विवरण"
            name="description"
            rules={[
              { required: true, message: "कृपया विवरण प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              फसल थप्नुहोस्
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </section>
  );
};

export default AddCropForm;
