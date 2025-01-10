import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, Checkbox, message } from "antd/lib";
import React, { useState } from "react";

interface AddSeasonModalProps {
  refetchData: () => void;
}

const AddSeasonModal = ({ refetchData }: AddSeasonModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { seasonName, fromSeason, toSeason, isActive } = values;

      // Format the dates
      const formattedFromSeason = fromSeason
        ? new Date(fromSeason).toISOString()
        : null;
      const formattedToSeason = toSeason
        ? new Date(toSeason).toISOString()
        : null;

      console.log("Sending data:", {
        seasonName,
        fromSeason: formattedFromSeason,
        toSeason: formattedToSeason,
        isActive: isActive || false,
      });

      axiosInstance
        .post("/crop-calendar/season", {
          seasonName,
          fromSeason: formattedFromSeason,
          toSeason: formattedToSeason,
          isActive: isActive || false,
        })
        .then((response) => {
          message.success("ऋतु सफलतापूर्वक थपियो!");
          setIsVisible(false);
          form.resetFields();
          refetchData();
        })
        .catch((error) => {
          message.error("ऋतु थप्न असफल भयो।");
          console.error("ऋतु थप्नमा त्रुटि:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsVisible(true)}>
        नयाँ ऋतु थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ ऋतु थप्नुहोस्"
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
            name="seasonName"
            label="ऋतुको नाम"
            rules={[
              { required: true, message: "कृपया ऋतुको नाम प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fromSeason"
            label="सुरुवाती मिति"
            rules={[
              {
                required: true,
                message: "कृपया सुरुवाती मिति प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <input
              type="date"
              style={{ width: "100%" }}
              onChange={(e) =>
                form.setFieldsValue({ fromSeason: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            name="toSeason"
            label="अन्त्य मिति"
            rules={[
              {
                required: true,
                message: "कृपया अन्त्य मिति प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <input
              type="date"
              style={{ width: "100%" }}
              onChange={(e) =>
                form.setFieldsValue({ toSeason: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>सक्रिय छ</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddSeasonModal;
