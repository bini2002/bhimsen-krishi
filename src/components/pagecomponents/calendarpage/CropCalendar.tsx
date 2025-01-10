import useFetchData from "@/hook/useFetchData";
import { ICrop } from "@/utils/interface";
import { Badge, Calendar } from "antd/lib";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddCropModal from "../cropspage/AddCropModal";

const CropCalendar: React.FC = () => {
  const [crops, setCrops] = useState<ICrop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { fetchedData: cropsData, refetchData } = useFetchData(
    "/crop-calendar/crop-calendar"
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        if (cropsData && cropsData.success) {
          setCrops(cropsData.data.result);
        }
      } catch (error) {
        console.error("फसल डाटा ल्याउनमा त्रुटि:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [cropsData]);

  const dateCellRender = (value: any) => {
    const date = dayjs(value.format("YYYY-MM-DD"));
    const cellContent: JSX.Element[] = [];

    crops.forEach((crop) => {
      const createdDate = dayjs(crop.createdAt).startOf("day");

      if (date.isSame(createdDate, "day")) {
        cellContent.push(
          <div
            key={crop.id}
            style={{
              backgroundColor: "#e6f7ff",
              borderRadius: "4px",
              padding: "2px",
              textAlign: "center",
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Badge color="blue" text={crop.cropName} />
          </div>
        );
      }
    });

    return <div>{cellContent}</div>;
  };

  return (
    <section>
      <div className="mb-4">
        <AddCropModal refetchData={refetchData} />
      </div>
      <div className="bg-white p-4 lg:p-8 rounded-xl shadow">
        <Calendar dateCellRender={dateCellRender} />
      </div>
    </section>
  );
};

export default CropCalendar;
