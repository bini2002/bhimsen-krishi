import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Form, Input, Modal, Select, Table, message } from "antd/lib";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import AddReportModal from "./AddReportModal";
import axios from "axios";
import { useSession } from "next-auth/react";

interface IReport {
  id: number;
  createdAt: string;
  isActive: boolean;
  description: string;
  type: string;
  extra: {
    id?: number;
  };
  user?: null | string;
}

const { Option } = Select;

const ReportsList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData("/report");
  const [filteredData, setFilteredData] = useState<IReport[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<IReport | null>(null);
  const [form] = Form.useForm();

  const { data: session } = useSession();

  // Populate filteredData when fetchedData changes
  useEffect(() => {
    if (fetchedData && fetchedData.success) {
      setFilteredData(fetchedData.data.data);
    }
  }, [fetchedData]);

  // Search handler for filtering reports by description
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = fetchedData.data.data.filter((report: IReport) =>
      report.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Edit report modal handler
  const handleEditClick = (report: IReport) => {
    setEditingReport(report);
    form.setFieldsValue({
      description: report.description,
      type: report.type,
    });
    setIsEditModalVisible(true);
  };

  // Cancel edit modal
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Save edited report data
  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingReport) {
        axios
          .patch(
            `${process.env.NEXT_PUBLIC_API_URL}/report/${editingReport.id}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.accessToken}`,
              },
            }
          )
          .then(() => {
            message.success("रिपोर्ट सफलतापूर्वक अपडेट गरियो!");
            setIsEditModalVisible(false);
            setFilteredData((prevData) =>
              prevData.map((report) =>
                report.id === editingReport.id
                  ? { ...report, ...values }
                  : report
              )
            );
            refetchData();
          })
          .catch((error) => {
            message.error("रिपोर्ट अपडेट गर्न असफल।");
            console.error("रिपोर्ट अपडेट गर्दा त्रुटि:", error);
          });
      }
    });
  };

  // Delete a report
  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/report/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      })
      .then(() => {
        message.success("रिपोर्ट सफलतापूर्वक हटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("रिपोर्ट हटाउन असफल।");
        console.error("रिपोर्ट हटाउँदा त्रुटि:", error);
      });
  };

  // Table columns definition
  const columns = [
    {
      title: "आईडी",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "वर्णन",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "प्रकार",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "सिर्जना मिति",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => dayjs(createdAt).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      title: "क्रिया",
      key: "action",
      render: (text: any, record: IReport) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditClick(record)} icon={<FaEdit />} />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<FaTrash />}
            className="hover:text-red-500"
          />
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <section>
      <h1 className="text-xl lg:text-2xl font-medium mb-4">
        रिपोर्टहरूको सूची
      </h1>
      <AddReportModal refetchData={refetchData} />
      <div className="flex justify-between my-4">
        <Input
          placeholder="वर्णनबाट खोज्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="रिपोर्ट सम्पादन गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            रद्द गर्नुहोस्
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            बचत गर्नुहोस्
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="description"
            label="वर्णन"
            rules={[
              { required: true, message: "कृपया वर्णन प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item
            name="type"
            label="प्रकार"
            rules={[{ required: true, message: "कृपया प्रकार चयन गर्नुहोस्" }]}
          >
            <Select placeholder="प्रकार चयन गर्नुहोस्">
              <Option value="forum">फोरम</Option>
              <Option value="comment">टिप्पणी</Option>
              <Option value="product">उत्पादन</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default ReportsList;
