/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  InputNumber,
  Select,
} from "antd/lib";
import { axiosInstance } from "@/utils/axiosInstance";
import { IAgroFirmKyc, IImage } from "@/utils/interface"; // Ensure this interface is defined
import useFetchData from "@/hook/useFetchData";
import { useSession } from "next-auth/react";
import AddAgroFirmKYCModal from "./AddAgroFirmKycModal";
import AgroFirmCard from "./AgroFirmCard";
import Image from "next/image";

const AgroFirmsKYCList: React.FC = () => {
  const { fetchedData, loading, refetchData } = useFetchData("/kyc/agrofirm");
  const [dataSource, setDataSource] = useState<IAgroFirmKyc[]>([]);
  const [editingKYC, setEditingKYC] = useState<IAgroFirmKyc | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { data } = useSession();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  // Fetch images
  const { fetchedData: imagesData } = useFetchData("/imageupload");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  useEffect(() => {
    if (fetchedData?.success) {
      setDataSource(fetchedData.data.result);
    }
  }, [fetchedData]);

  const [whomeTheySell, setWhomeTheySell] = useState<string[]>(
    editingKYC?.whomeTheySell || []
  );

  const handleAddWhom = () => {
    setWhomeTheySell([...whomeTheySell, ""]);
  };

  const handleRemoveWhom = (index: number) => {
    const newWhomTheySell = whomeTheySell.filter((_, i) => i !== index);
    setWhomeTheySell(newWhomTheySell);
  };

  const handleWhomeChange = (index: number, value: string) => {
    const newWhomTheySell = [...whomeTheySell];
    newWhomTheySell[index] = value;
    setWhomeTheySell(newWhomTheySell);
  };

  const handleEdit = (kyc: IAgroFirmKyc) => {
    setEditingKYC(kyc);
    form.setFieldsValue(kyc);
    setWhomeTheySell(kyc.whomeTheySell || []);
    setIsEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingKYC) {
        await axiosInstance.patch(
          `/kyc/agrofirm/${editingKYC.id}`,
          {
            ...values,
            whomeTheySell,
            images: selectedImages, // Add this line
          },
          {
            headers: { Authorization: `Bearer ${data?.user?.accessToken}` },
          }
        );
        message.success("KYC updated successfully!");
        setIsEditModalVisible(false);
        refetchData();
      }
    } catch (error) {
      message.error("Failed to update KYC.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/kyc/agrofirm/${id}`, {
        headers: { Authorization: `Bearer ${data?.user?.accessToken}` },
      });
      message.success("KYC deleted successfully!");
      refetchData();
    } catch (error) {
      message.error("Failed to delete KYC.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    const filteredData = fetchedData?.data.result.filter((kyc: IAgroFirmKyc) =>
      kyc.firmName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDataSource(filteredData || []);
  };

  const handleImageChange = (value: number[]) => {
    setSelectedImages(value);
  };

  return (
    <section className="">
      <h1 className="text-xl font-medium mb-4">एग्रो फर्मको KYC सूची</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-between my-4">
        <Input
          placeholder="Search by firm name"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <AddAgroFirmKYCModal refetchData={refetchData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSource.map((kyc) => (
          <AgroFirmCard
            key={kyc?.id}
            kyc={kyc}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      <Modal
        title="KYC सम्पादन गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            सुरक्षित गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firmName"
            label="फर्मको नाम"
            rules={[
              {
                required: true,
                message: "कृपया फर्मको नाम प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ward"
            label="वडा"
            rules={[
              {
                required: true,
                message: "कृपया वडा संख्या प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="address"
            label="ठेगाना"
            rules={[
              { required: true, message: "कृपया ठेगाना प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pan"
            label="PAN"
            rules={[
              { required: true, message: "कृपया PAN प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="annualInvestment"
            label="वार्षिक लगानी"
            rules={[
              {
                required: true,
                message: "कृपया वार्षिक लगानी प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="personalExpenses"
            label="व्यक्तिगत खर्च"
            rules={[
              {
                required: true,
                message: "कृपया व्यक्तिगत खर्च प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="annualTransaction"
            label="वार्षिक कारोबार"
            rules={[
              {
                required: true,
                message: "कृपया वार्षिक कारोबार प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="fullTimeEmpoloyees"
            label="पूर्णकालीन कर्मचारी"
            rules={[
              {
                required: true,
                message:
                  "कृपया पूर्णकालीन कर्मचारीको संख्या प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="parTimeEmployees"
            label="अंशकालीन कर्मचारी"
            rules={[
              {
                required: true,
                message: "कृपया अंशकालीन कर्मचारीको संख्या प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="प्रकार"
            rules={[{ required: true, message: "कृपया प्रकार चयन गर्नुहोस्" }]}
          >
            <Select placeholder="प्रकार चयन गर्नुहोस्">
              <Select.Option value="BUSINESS">व्यापार</Select.Option>
              <Select.Option value="GROUP">किसान</Select.Option>
              <Select.Option value="CO-OPERATIVE">सहकारी</Select.Option>
              {/* Add other types as needed */}
            </Select>
          </Form.Item>
          <Form.Item label="कसलाई बिक्री गरिन्छ">
            {whomeTheySell.map((whom, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  value={whom}
                  onChange={(e) => handleWhomeChange(index, e.target.value)}
                  style={{ width: "80%" }}
                  placeholder="नाम प्रविष्ट गर्नुहोस्"
                />
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveWhom(index)}
                  style={{ marginLeft: "8px" }}
                >
                  हटाउनुहोस्
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddWhom}
              style={{ width: "100%" }}
            >
              थप्नुहोस्
            </Button>
          </Form.Item>
          <Form.Item
            label="तस्बिरहरू"
            name="images" // Ensure this matches the initialValues
            rules={[
              { required: true, message: "कृपया तस्बिरहरू चयन गर्नुहोस्" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="तस्बिरहरू चयन गर्नुहोस्"
              onChange={handleImageChange}
              value={selectedImages} // Bind the selected images here
            >
              {imagesData?.data?.result?.length ? (
                imagesData.data.result.map((image: IImage) => (
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
                      {image?.name}
                    </div>
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No images available</Select.Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default AgroFirmsKYCList;
