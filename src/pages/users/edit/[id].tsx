import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import EditUserProfile from "@/components/pagecomponents/userspage/EditUserProfile";
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { Spin, message } from "antd/lib";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditUserPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>();
  const { fetchedData, loading } = useFetchData(`/profile/${id}`);

  const userData = fetchedData?.data;

  useEffect(() => {
    if (userData) {
      const completeUserData = {
        user: userData?.user?.userId,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        picture: userData.picture || 0,
        gender: userData.gender || "",
        dob: userData.dob || "",
        skills: userData.skills || [],
        education: userData.education || [],
        citizenshipNumber: userData.citizenshipNumber || "",
        citizenshipIssuedDate: userData.citizenshipIssuedDate || "",
        ward: userData.ward || 0,
        tole: userData.tole || "",
        district: userData.district || "",
        pradesh: userData.pradesh || "",
        municipality: userData.municipality || "",
        landmark: userData.landmark || "",
        tWard: userData.tWard || 0,
        tTole: userData.tTole || "",
        tLandmark: userData.tLandmark || "",
        tDistrict: userData.tDistrict || "",
        tPradesh: userData.tPradesh || "",
        tMunicipality: userData.tMunicipality || "",
        citizenshipBack: userData.citizenshipBack || 0,
        citizenshipFront: userData.citizenshipFront || 0,
      };
      setUser(completeUserData);
    }
  }, [userData]);

  const { data: session } = useSession();

  const handleUserUpdate = async (updatedUser: any) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/profile/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      console.log("Updated User Data:", response.data);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(
        "There was an error updating the profile. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <GoBackButton />
        <div className="flex items-center justify-center w-full min-h-[80vh]">
          <Spin size="large" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <GoBackButton />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile Not Found</h1>
            <p className="text-gray-600">
              The user profile you are looking for does not exist or cannot be
              loaded.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <GoBackButton />
      <EditUserProfile user={user} onSubmit={handleUserUpdate} />
    </PageLayout>
  );
};

export default withAuth(EditUserPage);
