/* eslint-disable jsx-a11y/alt-text */
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, InputNumber, Modal, Switch, message } from "antd/lib";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface AddFarmerKYCModalProps {
  refetchData: () => void;
}

const AddFarmerKYCModal = ({ refetchData }: AddFarmerKYCModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const { data } = useSession();

  const handleSave = () => {
    form.validateFields().then((values) => {
      axiosInstance
        .post(
          "/kyc/farmer",
          {
            area: values.area,
            fertileSoil: values.fertileSoil,
            unfertileSoil: values.unfertileSoil,
            isOnLease: values.isOnLease,
            hasTunnelFarming: values.hasTunnelFarming,
            hasRoadAccess: values.hasRoadAccess,
          },
          {
            headers: {
              Authorization: `Bearer ${data?.user?.accessToken}`,
            },
          }
        )
        .then((response) => {
          message.success("किसान KYC सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("किसान KYC थप्न असफल भयो।");
          console.error("Error adding Farmer KYC:", error);
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
        तपाईंको किसान KYC थप्नुहोस्
      </Button>
      <Modal
        title="किसान KYC थप्नुहोस्"
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
            name="area"
            label="क्षेत्र (वर्ग मिटर)"
            rules={[
              { required: true, message: "कृपया क्षेत्र प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="fertileSoil"
            label="उपजाऊ माटो (वर्ग मिटर)"
            rules={[
              {
                required: true,
                message: "कृपया उपजाऊ माटोको मात्रा प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="unfertileSoil"
            label="उपजाऊ नभएको माटो (वर्ग मिटर)"
            rules={[
              {
                required: true,
                message: "कृपया उपजाऊ नभएको माटोको मात्रा प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="isOnLease"
            label="भूमि लिजमा छ?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasRoadAccess"
            label="सड़क पहुँच छ?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasTunnelFarming"
            label="सुरुङ खेती छ?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddFarmerKYCModal;
