import { axiosInstance } from "@/utils/axiosInstance";
import { RcFile } from "antd/es/upload/interface";
import { Button, Form, Input, Modal, Upload, message } from "antd/lib";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";

interface AddImageModalProps {
  refetchData: () => void;
}

const AddImageModal = ({ refetchData }: AddImageModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.image && values.image[0]) {
        formData.append("image", values.image[0].originFileObj as RcFile);
      }

      axiosInstance
        .post("/imageupload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          message.success("छवि सफलतापूर्वक थपिएको छ!");
          setIsVisible(false);
          form.resetFields();
          setFileList([]);
          refetchData();
        })
        .catch((error) => {
          message.error("छवि थप्न असफल।");
          console.error("Error adding image:", error);
        });
    });
  };

  const handleCancel = () => {
    setIsVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleUploadChange = (info: any) => {
    if (info.file.status === "done") {
      setFileList([
        {
          uid: info.file.uid,
          name: info.file.name,
          status: "done",
          url: info.file.response?.url,
        },
      ]);
    }
  };

  return (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => setIsVisible(true)}
      >
        नयाँ छवि थप्नुहोस्
      </Button>
      <Modal
        title="नयाँ छवि थप्नुहोस्"
        visible={isVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="नाम"
            name="name"
            rules={[{ required: true, message: "छविको नाम प्रवेश गर्नुहोस्" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="छवि"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            extra="एक छवि फाइल अपलोड गर्नुहोस्"
          >
            <Upload
              name="image"
              listType="picture"
              fileList={fileList}
              customRequest={({ file, onSuccess }) => {
                // अपलोड अनुरोधको अनुकरण गर्नुहोस्
                setTimeout(() => onSuccess?.("ok"), 0);
              }}
              onChange={handleUploadChange}
              action="/upload"
              headers={{ authorization: "authorization-text" }}
            >
              <Button icon={<FiUpload />}>अपलोड गर्नुहोस्</Button>
            </Upload>
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

export default AddImageModal;
