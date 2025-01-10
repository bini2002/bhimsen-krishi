"use client";
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { imageHelper } from "@/utils/imageHelper";
import { Button, message, Popconfirm, Table, Tag } from "antd/lib";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import AddUserModal from "./AddUserModal";

interface User {
  userId: string;
  email: string;
  isActive: boolean;
  profile: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    picture: number | null;
    phone: string | null;
  } | null;
}

const UsersList = () => {
  const {
    fetchedData: usersData,
    loading: usersLoading,
    refetchData,
  } = useFetchData("/user");
  const { fetchedData: profilesData, loading: profilesLoading } =
    useFetchData("/profile");

  const [users, setUsers] = useState<User[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (usersData?.data?.result) {
      const usersWithProfiles = usersData.data.result.map((user: any) => {
        const profile = profilesData?.data?.result?.find(
          (p: any) => p.id === user.profile
        );
        return {
          ...user,
          profile,
        };
      });
      setUsers(usersWithProfiles);

      const fetchImages = async () => {
        const urls: { [key: number]: string } = {};
        for (const user of usersWithProfiles) {
          if (user.profile?.picture) {
            const url = await imageHelper(user.profile.picture);
            if (url) urls[user.profile.picture] = url;
          }
        }
        setImageUrls(urls);
      };

      fetchImages();
    }
  }, [usersData, profilesData]);

  const { data: session } = useSession();

  const handleDelete = async (userId: string) => {
    try {
      await axiosInstance.delete(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
      message.success("प्रयोगकर्ता सफलतापूर्वक मेटाइयो");
    } catch (error) {
      message.error("प्रयोगकर्ता मेटाउन समस्या आयो");
    }
  };

  const handleView = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleAddKyc = (userId: string) => {
    router.push(`/users/add-profile/${userId}`);
  };

  const handleEdit = (userId: string) => {
    router.push(`/users/edit/${userId}`);
  };

  const columns = [
    {
      title: "नाम",
      dataIndex: "profile",
      render: (profile: {
        firstName: string | null;
        lastName: string | null;
      }) =>
        profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : "N/A",
    },
    {
      title: "तस्बिर",
      dataIndex: "profile",
      render: (profile: { picture: number | null }) =>
        profile?.picture && imageUrls[profile.picture] ? (
          <Image
            src={imageUrls[profile.picture]}
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
      title: "ईमेल",
      dataIndex: "email",
    },
    {
      title: "फोन नम्बर",
      dataIndex: "profile",
      render: (profile: { phone: string | null }) => profile?.phone || "N/A",
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
      render: (record: User) => {
        return (
          <div className="flex items-center space-x-2">
            {/* View button */}
            <Button
              type="default"
              size="small"
              onClick={() => handleView(record.userId)}
              icon={<AiOutlineEye />}
            />

            {/* Delete button */}
            <Popconfirm
              title="के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो प्रयोगकर्ता मेटाउन चाहनुहुन्छ?"
              onConfirm={() => handleDelete(record.userId)}
              okText="हो"
              cancelText="होइन"
            >
              <Button type="dashed" size="small" icon={<AiOutlineDelete />} />
            </Popconfirm>
            {(!record.profile ||
              !record.profile.firstName ||
              !record.profile.lastName) && (
              <Button
                type="primary"
                size="small"
                onClick={() => handleAddKyc(record?.userId)}
              >
                KYC पूरा गर्नुहोस्
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">प्रयोगकर्ताहरूको सूची</h2>
      <div className="my-4">
        <AddUserModal refetchData={refetchData} />
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
        loading={usersLoading || profilesLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UsersList;
