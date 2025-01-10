import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd/lib";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomEditor from "./custom-editor";
import { FinanceKeyType } from "@/types/finance-keys";

interface IBusinessCommodity {
  id: number;
  name: string;
  isActive: boolean;
  category: number;
  template: any;
}

interface IBusinessCategory {
  id: number;
  name: string;
}

const BusinessCommodityList: React.FC = () => {
  const router = useRouter();
  const [commodities, setCommodities] = useState<IBusinessCommodity[]>([]);
  const [filteredCommodities, setFilteredCommodities] = useState<
    IBusinessCommodity[]
  >([]);
  const [categories, setCategories] = useState<IBusinessCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCommodity, setEditingCommodity] =
    useState<IBusinessCommodity | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [template, setTemplate] = useState<string>("");

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
  };
  const [form] = Form.useForm();

  const { fetchedData: fetchedCommodities, refetchData } = useFetchData(
    "/business-commodity"
  );
  const { fetchedData: fetchedCategories } = useFetchData(
    "/business-model-category"
  );

  useEffect(() => {
    if (fetchedCommodities?.data?.data) {
      setCommodities(fetchedCommodities.data.data);
      setFilteredCommodities(fetchedCommodities.data.data);
    }
  }, [fetchedCommodities]);

  useEffect(() => {
    if (fetchedCategories?.data?.data) {
      setCategories(fetchedCategories.data.data);
    }
  }, [fetchedCategories]);

  const handleSearch = debounce((value: string) => {
    setFilteredCommodities(
      commodities.filter((commodity) =>
        commodity.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, 300);

  const openModal = (commodity: IBusinessCommodity) => {
    setEditingCommodity(commodity);
    setTemplate(commodity.template || "");
    setIsModalVisible(true);
    form.setFieldsValue(commodity);
  };

  const handleSaveCommodity = async (values: Partial<IBusinessCommodity>) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/business-commodity/${editingCommodity?.id}`, {
        ...values,
        template,
      });
      message.success("बिजनेस वस्तु सफलतापूर्वक अद्यावधिक गरियो।");
      refetchData();
      setIsModalVisible(false);
    } catch {
      message.error("बिजनेस वस्तु अद्यावधिक गर्न त्रुटि।");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "तपाईं यस बिजनेस वस्तु मेटाउन निश्चित हुनुहुन्छ?",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/business-commodity/${id}`);
          message.success("बिजनेस वस्तु मेटाइयो।");
          setFilteredCommodities(
            filteredCommodities.filter((com) => com.id !== id)
          );
          refetchData();
        } catch {
          message.error("बिजनेस वस्तु मेटाउन त्रुटि।");
        }
      },
    });
  };

  const handleCopyToClipboard = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    message.success(`Copied variable: {{${variable}}}`);
  };

  const columns = [
    { title: "नाम", dataIndex: "name", key: "name" },
    {
      title: "श्रेणी",
      dataIndex: "category",
      key: "category",
      render: (categoryId: number) =>
        categories.find((cat) => cat.id === categoryId)?.name || "N/A",
    },
    {
      title: "कार्यहरू",
      key: "actions",
      render: (_: any, record: IBusinessCommodity) => (
        <>
          <div className="flex space-x-2">
            <Button onClick={() => openModal(record)} icon={<FaEdit />} />
            <Button
              onClick={() => handleDelete(record.id)}
              danger
              icon={<FaTrash />}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="बिजनेस वस्तुहरू खोज्नुहोस्"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-2/3"
        />
        <Button
          type="primary"
          onClick={() => router.push("/business-commodities/add")}
        >
          वस्तु थप्नुहोस्
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCommodities}
        loading={loading}
        rowKey="id"
      />

      <Modal
        open={isModalVisible}
        title="अद्यावधिक गर्नुहोस् बिजनेस वस्तु"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          id="commodityForm"
          initialValues={editingCommodity || {}}
          onFinish={handleSaveCommodity}
          onFinishFailed={() => message.error("कृपया फारम पूरा गर्नुहोस्!")}
        >
          <Form.Item
            name="name"
            label="वस्तुको नाम"
            rules={[
              {
                required: true,
                message: "कृपया वस्तुको नाम प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="श्रेणी"
            rules={[
              { required: true, message: "कृपया एक श्रेणी चयन गर्नुहोस्" },
            ]}
          >
            <Select placeholder="श्रेणी चयन गर्नुहोस्">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Template" name="template" required>
            <CustomEditor value={template} onChange={handleTemplateChange} />
          </Form.Item>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Financial Variables</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(FinanceKeyType).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm bg-gray-100 p-2 rounded">{`{{${key}}}`}</span>
                  <Button
                    size="small"
                    onClick={() => handleCopyToClipboard(key)}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>सक्रिय</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              अद्यावधिक गर्नुहोस् वस्तु
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessCommodityList;
