import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { imageHelper } from "@/utils/imageHelper";
import { message } from "antd/lib";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd/lib";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Image from "next/image";
import AddExpertModal from "./AddExpertsModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Expert {
  id: number;
  isActive: boolean;
  type: string;
  user: {
    userId: string;
    email: string | null;
    emailVerified: boolean;
    profile: {
      firstName: string | null;
      lastName: string | null;
      picture: number | null;
    } | null;
  };
}

const ExpertsList = () => {
  const {
    fetchedData: expertsData,
    loading: expertsLoading,
    refetchData,
  } = useFetchData("/experts");
  const {
    fetchedData: usersData,
    loading: usersLoading,
    refetchData: refetchUsers,
  } = useFetchData("/user");

  const [experts, setExperts] = useState<Expert[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (expertsData?.data?.data) {
      setExperts(expertsData.data.data);

      // Fetch images for experts
      const fetchImages = async () => {
        const urls: { [key: number]: string } = {};
        for (const expert of expertsData.data.data) {
          if (expert.user.profile?.picture) {
            const url = await imageHelper(expert.user.profile.picture);
            if (url) urls[expert.user.profile.picture] = url;
          }
        }
        setImageUrls(urls);
      };

      fetchImages();
    }
  }, [expertsData]);

  const handleEdit = (expert: Expert) => {
    setSelectedExpert(expert);
    form.setFieldsValue({ type: expert.type, user: expert.user.userId });
    setIsEditModalVisible(true);
  };

  const { data: session } = useSession();

  const handleUpdate = async (values: any) => {
    if (selectedExpert) {
      const updatedExpert = { type: values.type, user: values.user };

      try {
        await axiosInstance.patch(
          `/experts/${selectedExpert.id}`,
          updatedExpert,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        setExperts((prevExperts) =>
          prevExperts.map((exp) =>
            exp.id === selectedExpert.id ? { ...exp, ...updatedExpert } : exp
          )
        );
        setIsEditModalVisible(false);
        message.success("विशेषज्ञ सफलतापूर्वक अद्यावधिक गरियो");
      } catch (error) {
        message.error("विशेषज्ञ अद्यावधिक गर्दा समस्या आयो");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/experts/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      setExperts((prevExperts) => prevExperts.filter((exp) => exp.id !== id));
      message.success("विशेषज्ञ सफलतापूर्वक मेटाइयो");
    } catch (error) {
      message.error("विशेषज्ञ मेटाउन समस्या आयो");
    }
  };

  const router = useRouter();

  const handleKYC = (userId: string) => {
    router.push(`/users/add-profile/${userId}`);
  };

  const columns = [
    {
      title: "ईमेल",
      dataIndex: "user",
      render: (user: { email: string }) => user?.email || "N/A",
    },
    {
      title: "नाम",
      dataIndex: "user",
      render: (user: {
        profile: { firstName: string; lastName: string } | null;
      }) =>
        user?.profile?.firstName && user.profile.lastName
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : "N/A",
    },
    {
      title: "तस्बिर",
      dataIndex: "user",
      render: (user: { profile: { picture: number | null } }) =>
        user?.profile?.picture && imageUrls[user.profile.picture] ? (
          <Image
            src={imageUrls[user.profile.picture]}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full w-12 h-12 object-cover"
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "विशेषज्ञ प्रकार",
      dataIndex: "type",
    },
    {
      title: "स्थिति",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "सक्रिय" : "निष्क्रिय"}
        </Tag>
      ),
    },
    {
      title: "कार्यवाही",
      render: (record: Expert) => (
        <div className="flex items-center space-x-2">
          {!record.user.profile && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleKYC(record.user.userId)}
            >
              KYC पूरा गर्नुहोस्
            </Button>
          )}

          <Button
            type="dashed"
            size="small"
            onClick={() => handleEdit(record)}
            icon={<AiOutlineEdit />}
          />

          <Popconfirm
            title="के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो विशेषज्ञ मेटाउन चाहनुहुन्छ?"
            onConfirm={() => handleDelete(record.id)}
            okText="हो"
            cancelText="होइन"
          >
            <Button type="dashed" size="small" icon={<AiOutlineDelete />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">विशेषज्ञहरूको सूची</h2>
      <div className="my-4">
        <AddExpertModal refetchData={refetchData} refetchUsers={refetchUsers} />
      </div>

      <Table
        columns={columns}
        dataSource={experts}
        rowKey="id"
        loading={expertsLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="विशेषज्ञ अद्यावधिक गर्नुहोस्"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleUpdate(values);
              form.resetFields();
            })
            .catch((error) => console.error("Validation failed:", error));
        }}
        confirmLoading={expertsLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="प्रयोगकर्ता"
            name="user"
            rules={[
              { required: true, message: "कृपया प्रयोगकर्ता चयन गर्नुहोस्" },
            ]}
          >
            <Select
              loading={usersLoading}
              placeholder="प्रयोगकर्ता चयन गर्नुहोस्"
            >
              {usersData?.data?.result?.map(
                (user: { userId: string; email: string }) => (
                  <Select.Option key={user?.userId} value={user?.userId}>
                    {user?.email}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="विशेषज्ञ प्रकार"
            name="type"
            rules={[
              { required: true, message: "कृपया प्रकार प्रविष्ट गर्नुहोस्" },
            ]}
          >
            <Input placeholder="प्रकार प्रविष्ट गर्नुहोस्" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpertsList;
