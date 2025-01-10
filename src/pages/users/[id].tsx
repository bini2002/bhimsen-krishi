import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import UserProfile from "@/components/pagecomponents/userslistpage/UserProfile";
import useFetchData from "@/hook/useFetchData";
import { axiosInstance } from "@/utils/axiosInstance";
import { imageHelper } from "@/utils/imageHelper";
import { Button, Spin } from "antd/lib";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Document {
  url: string;
  name: string;
}

interface UserProfileProps {
  photo: string;
  name: string;
  gender: string;
  dob: string;
  nationality: string;
  address: string;
  country: string;
  phoneNumber: string;
  email: string;
  documents: Document[];
}

const DEFAULT_NO_IMAGE = "/no-image.jpg";

const UsersProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const { fetchedData: userData, loading: userLoading } = useFetchData(
    `/user/${id}`
  );

  // Define handleEdit function outside of useEffect to be accessible in JSX
  const handleEdit = () => {
    router.push(`/users/edit/${userData?.data?.profile}`);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "loading") return;

      if (!session?.user?.accessToken) {
        router.push("/login");
        return;
      }

      if (!id || Array.isArray(id)) {
        setError("Invalid user ID.");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/profile/${userData?.data?.profile}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        const profileData = response.data.data;

        setProfile({
          photo: (await imageHelper(profileData?.picture)) || DEFAULT_NO_IMAGE,
          name: `${profileData.firstName || "N/A"} ${
            profileData.lastName || "N/A"
          }`,
          gender: profileData.gender || "N/A",
          dob: profileData.dob
            ? new Date(profileData.dob).toLocaleDateString()
            : "N/A",
          nationality: profileData.nationality || "N/A",
          address: `${profileData.pradesh || "N/A"}, ${
            profileData.district || "N/A"
          }, ${profileData.municipality || "N/A"}, Ward ${
            profileData.ward || "N/A"
          }, Tole ${profileData.tole || "N/A"}`,
          country: profileData.country || "N/A",
          phoneNumber: profileData.phoneNumber || "N/A",
          email: profileData.user.email || "N/A",
          documents: [
            {
              url:
                (await imageHelper(profileData?.citizenshipFront)) ||
                DEFAULT_NO_IMAGE,
              name: "Citizenship Front",
            },
            {
              url:
                (await imageHelper(profileData?.citizenshipBack)) ||
                DEFAULT_NO_IMAGE,
              name: "Citizenship Back",
            },
          ],
        });
      } catch (error) {
        setError("Failed to fetch profile data.");
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) fetchProfile();
  }, [id, router, session, status, userData?.data?.profile]);

  if (userLoading || loading) {
    return (
      <PageLayout>
        <GoBackButton />
        <div className="flex items-center justify-center w-full min-h-[80vh]">
          <Spin size="large" />
        </div>
      </PageLayout>
    );
  }

  if (!userData) {
    return (
      <PageLayout>
        <GoBackButton />
        <div className="flex flex-col items-center py-10">
          <p className="text-lg font-semibold text-gray-700">
            This user does not exist.
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <GoBackButton />
        <div className="flex flex-col items-center py-10">
          <p className="text-lg font-semibold text-gray-700">
            User Email:{" "}
            <span className="text-blue-500">{userData?.data?.email}</span>
          </p>
          <p className="text-md text-gray-600 mt-4">
            No profile data available for this user.
          </p>
          <Button type="primary" className="mt-4">
            Fill KYC Form
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <GoBackButton />
      {profile && (
        <div className="my-4">
          <Button onClick={handleEdit}>Edit this profile</Button>
        </div>
      )}

      <UserProfile {...profile} />
    </PageLayout>
  );
};

export default withAuth(UsersProfileView);
