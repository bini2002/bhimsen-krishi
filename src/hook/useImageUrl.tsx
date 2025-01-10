// src/hooks/useImageUrl.ts

import { useEffect, useState } from "react";
import useFetchData from "@/hook/useFetchData";
import { IImage } from "@/utils/interface";

export const useImageUrl = (imageId: number | null) => {
  const { fetchedData } = useFetchData("/imageupload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageId && fetchedData?.data?.data) {
      const image = fetchedData.data.data.find(
        (img: IImage) => img.id === imageId
      );
      setImageUrl(
        image ? `${process.env.NEXT_PUBLIC_API_URL}/${image.image}` : null
      );
    }
  }, [imageId, fetchedData]);

  return imageUrl;
};
