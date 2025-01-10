import { Modal, Button, Form, Input, Select, message } from "antd/lib";
import React, { useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSession } from "next-auth/react";

interface AddReportModalProps {
  refetchData: () => void;
}

const { Option } = Select;

const AddReportModal: React.FC<AddReportModalProps> = ({ refetchData }) => {
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      axiosInstance
        .post(
          "/report",
          {
            description: values.description,
            type: values.type,
            extra: values.extra ? JSON.parse(values.extra) : {}, // Convert extra field to object
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        )
        .then(() => {
          message.success("रिपोर्ट सफलतापूर्वक थपियो!");
          handleCancel();
          refetchData();
        })
        .catch((error) => {
          message.error("रिपोर्ट थप्न असफल भयो।");
          console.error("Error adding report:", error);
        });
    });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        रिपोर्ट थप्नुहोस्
      </Button>
      <Modal
        title="रिपोर्ट थप्नुहोस्"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            सेभ गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="description"
            label="विवरण"
            rules={[
              {
                required: true,
                message: "कृपया रिपोर्टको विवरण प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input.TextArea
              placeholder="रिपोर्ट विवरण प्रविष्ट गर्नुहोस्"
              rows={10}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="प्रकार"
            rules={[
              { required: true, message: "कृपया रिपोर्ट प्रकार चयन गर्नुहोस्" },
            ]}
          >
            <Select placeholder="रिपोर्ट प्रकार चयन गर्नुहोस्">
              <Option value="forum">फोरम</Option>
              <Option value="comment">टिप्पणी</Option>
              <Option value="product">उत्पादन</Option>
            </Select>
          </Form.Item>
          {/* <Form.Item
            name="extra"
            label="अतिरिक्त (JSON ढाँचामा)"
            tooltip="अतिरिक्त डाटा JSON ढाँचामा प्रविष्ट गर्नुहोस्"
          >
            <Input.TextArea
              placeholder='e.g., {"field1": "value1", "field2": "value2"}'
              rows={2}
            />
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default AddReportModal;
