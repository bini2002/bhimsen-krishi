import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { ISeason } from "@/utils/interface";
import { Button, Checkbox, Form, Input, Modal, Table, message } from "antd/lib";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddSeasonModal from "./AddSeasonModal";
import dayjs from "dayjs";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "जन",
    "फेब",
    "मार्च",
    "अप्रिल",
    "मय",
    "जुन",
    "जुलाइ",
    "अगस्ट",
    "सेप्टेम्बर",
    "अक्टोबर",
    "नोभेम्बर",
    "डिसेम्बर",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const SeasonsList: React.FC = () => {
  const { fetchedData, refetchData } = useFetchData("/crop-calendar/season");
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ISeason[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSeason, setEditingSeason] = useState<ISeason | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (fetchedData && fetchedData.success) {
      setFilteredData(fetchedData.data.result);
    }
  }, [fetchedData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filtered = fetchedData.data.result.filter((season: ISeason) =>
      season.seasonName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEditClick = (season: ISeason) => {
    setEditingSeason(season);
    form.setFieldsValue({
      seasonName: season.seasonName,
      fromSeason: dayjs(season.fromSeason).format("YYYY-MM-DD"),
      toSeason: dayjs(season.toSeason).format("YYYY-MM-DD"),
      isActive: season.isActive,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      if (editingSeason) {
        axiosInstance
          .patch(`/crop-calendar/season/${editingSeason.id}`, {
            seasonName: values.seasonName,
            fromSeason: new Date(values.fromSeason).toISOString(),
            toSeason: new Date(values.toSeason).toISOString(),
            isActive: values.isActive,
          })
          .then((response) => {
            message.success("मौसम सफलतापूर्वक अद्यावधिक गरियो!");
            setIsEditModalVisible(false);
            // स्थानिय राज्य अद्यावधिक गर्नका लागि परिवर्तनहरू प्रतिबिम्बित गर्नुहोस्
            setFilteredData((prevData) =>
              prevData.map((season) =>
                season.id === editingSeason.id
                  ? { ...season, ...values }
                  : season
              )
            );
            refetchData();
          })
          .catch((error) => {
            message.error("मौसम अद्यावधिक गर्न असफल।");
            console.error("मौसम अद्यावधिक गर्दा त्रुटि:", error);
          });
      }
    });
  };

  const handleDelete = (id: number) => {
    axiosInstance
      .delete(`/crop-calendar/season/${id}`)
      .then((response) => {
        message.success("मौसम सफलतापूर्वक मेटाइयो!");
        refetchData();
      })
      .catch((error) => {
        message.error("मौसम मेट्न असफल।");
        console.error("मौसम मेट्न त्रुटि:", error);
      });
  };

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: () => <Checkbox />,
      width: 50,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "नाम",
      dataIndex: "seasonName",
      key: "seasonName",
      width: 200,
    },
    {
      title: "सुरुवात मिति",
      dataIndex: "fromSeason",
      key: "fromSeason",
      render: (text: string) => formatDate(text),
      width: 150,
    },
    {
      title: "अन्तिम मिति",
      dataIndex: "toSeason",
      key: "toSeason",
      render: (text: string) => formatDate(text),
      width: 150,
    },
    {
      title: "कार्य",
      key: "action",
      render: (text: any, record: ISeason) => (
        <div className="grid grid-cols-2 px-2 border rounded-lg divide-x-2">
          <div className="flex justify-center py-2">
            <button onClick={() => handleEditClick(record)}>
              <FaEdit className="text-gray-700" />
            </button>
          </div>
          <div className="flex justify-center py-2">
            <button onClick={() => handleDelete(record?.id)}>
              <FaTrash className="text-red-500" />
            </button>
          </div>
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <section className="p-4">
      <h1 className="text-xl lg:text-2xl font-medium mb-4">मौसमको सूची</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="मौसमको नामद्वारा खोजी गर्नुहोस्"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <AddSeasonModal refetchData={refetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        className="bg-white"
      />
      <Modal
        title="मौसम सम्पादन गर्नुहोस्"
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
            name="seasonName"
            label="मौसमको नाम"
            rules={[
              {
                required: true,
                message: "कृपया मौसमको नाम प्रविष्ट गर्नुहोस्",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fromSeason"
            label="सुरुवात मिति"
            rules={[
              {
                required: true,
                message: "कृपया सुरुवात मिति प्रविष्ट गर्नुहोस्",
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
            label="अन्तिम मिति"
            rules={[
              {
                required: true,
                message: "कृपया अन्तिम मिति प्रविष्ट गर्नुहोस्",
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
          <Form.Item
            name="isActive"
            valuePropName="checked"
            initialValue={editingSeason?.isActive}
          >
            <Checkbox>सक्रिय</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default SeasonsList;
