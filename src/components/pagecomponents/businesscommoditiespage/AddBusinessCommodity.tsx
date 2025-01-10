import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Select, Switch, message } from "antd/lib";
import React, { useEffect, useState } from "react";
import CustomEditor from "./custom-editor";

const AddBusinessCommodity: React.FC = () => {
  const [form] = Form.useForm();
  const [template, setTemplate] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const { fetchedData: fetchedCategories } = useFetchData(
    "/business-model-category"
  );

  // Directly defining the financial variables here as strings
  const [variables, setVariables] = useState<string[]>([
    "fixedCapital",
    "workingCapital",
    "fixedCost",
    "workingCost",
    "profitLoss",
  ]);

  const handleCopyToClipboard = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    message.success(`Copied variable: {{${variable}}}`);
  };

  useEffect(() => {
    if (fetchedCategories?.data?.data) {
      setCategories(fetchedCategories.data.data);
    }
  }, [fetchedCategories]);

  const handleSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      category: values.category,
      isActive: values.isActive,
      template: template,
    };

    try {
      await axiosInstance.post("/business-commodity", payload);
      message.success("Commodity added successfully!");
      form.resetFields();
      setTemplate("");
    } catch (error) {
      console.error(error);
      message.error("Failed to add commodity.");
    }
  };

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4">Add Business Commodity</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Enter commodity name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="श्रेणी चयन गर्नुहोस्">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* CustomEditor Form Item */}
        <Form.Item label="Template" name="template" required>
          <CustomEditor value={template} onChange={handleTemplateChange} />
        </Form.Item>

        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Financial Variables</h3>
          <div className="grid grid-cols-2 gap-2">
            {variables.map((variable) => (
              <div key={variable} className="flex items-center gap-2">
                <span className="text-sm bg-gray-100 p-2 rounded">{`{{${variable}}}`}</span>
                <Button
                  size="small"
                  onClick={() => handleCopyToClipboard(variable)}
                >
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Commodity
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBusinessCommodity;
