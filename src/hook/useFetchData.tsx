/* eslint-disable react-hooks/exhaustive-deps */
import { axiosInstance } from "@/utils/axiosInstance";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useFetchData = (url: string) => {
  const [fetchedData, setFetchData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchData();
    }
  }, [session?.user?.accessToken]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      setFetchData(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        signIn(); // Redirect to sign-in if unauthorized
      } else {
        console.error("Error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchedData, loading, refetchData: fetchData };
};

export default useFetchData;
