import { useEffect } from "react";
import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/utils/axiosInstance";

const NotificationPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (session?.user?.accessToken) {
          const response = await axiosInstance.get("/notification", {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [session]);

  return (
    <PageLayout>
      <GoBackButton />
      Notifications
    </PageLayout>
  );
};

export default withAuth(NotificationPage);
