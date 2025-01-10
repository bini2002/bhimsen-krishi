import useFetchData from "@/hook/useFetchData";
import { ISeason } from "@/utils/interface";
import { Badge, Calendar, Select } from "antd/lib";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddSeasonModal from "../seasonspage/AddSeasonModal";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;

const SeasonCalendar: React.FC = () => {
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<ISeason | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);

  const { fetchedData: seasonsData, refetchData } = useFetchData(
    "/crop-calendar/season"
  );
  const router = useRouter();

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        if (seasonsData && seasonsData.success) {
          setSeasons(seasonsData.data.result);
        }
      } catch (error) {
        console.error("मौसाम डाटा ल्याउनमा त्रुटि:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, [seasonsData]);

  useEffect(() => {
    if (selectedSeason) {
      const startMonth = dayjs(selectedSeason.fromSeason).startOf("month");
      setSelectedMonth(startMonth);
    }
  }, [selectedSeason]);

  const handleSeasonChange = (seasonId: number) => {
    const season = seasons.find((s) => s.id === seasonId);
    setSelectedSeason(season || null);
  };

  const handlePanelChange = (value: dayjs.Dayjs) => {
    if (selectedMonth && value.isSame(selectedMonth, "month")) {
      const calendar = document.querySelector(".ant-calendar-body");

      if (calendar) {
        const cells = calendar.querySelectorAll(".ant-calendar-month");
        cells.forEach((cell) => {
          const cellDate = dayjs(cell.getAttribute("title") || "");
          if (cellDate.isSame(selectedMonth, "month")) {
            cell.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    }
  };

  const dateCellRender = (value: any) => {
    if (selectedSeason) {
      const date = dayjs(value.format("YYYY-MM-DD"));
      const startDate = dayjs(selectedSeason.fromSeason).startOf("day");
      const endDate = dayjs(selectedSeason.toSeason).endOf("day");

      if (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {
        return (
          <div
            style={{
              backgroundColor: "#e6f7ff", // हल्का नीलो पृष्ठभूमि हाइलाइट गरिएका कक्षहरूको लागि
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
            <Badge color="blue" text={`${selectedSeason.seasonName}`} />
          </div>
        );
      }
    }
    return null;
  };

  const handleAddNewSeason = () => {
    router.push("/seasons/add");
  };

  return (
    <section>
      <div className="mb-4">
        <Select
          placeholder="एक मौसम चयन गर्नुहोस्"
          style={{ width: 300 }}
          onChange={handleSeasonChange}
          loading={loading}
          allowClear
          dropdownRender={(menu) => (
            <>
              {menu}
              <AddSeasonModal refetchData={refetchData} />
            </>
          )}
        >
          {seasons.map((season) => (
            <Option key={season.id} value={season.id}>
              {season.seasonName}
            </Option>
          ))}
        </Select>
      </div>
      <div className="bg-white p-4 lg:p-8 rounded-xl shadow">
        <Calendar
          dateCellRender={dateCellRender}
          onPanelChange={handlePanelChange}
        />
      </div>
    </section>
  );
};

export default SeasonCalendar;
