import useFetchData from "@/hook/useFetchData";
import { GrUserExpert } from "react-icons/gr";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from "react-icons/hi"; // Outline icons
import StatsCard from "./StatsCard";

export default function DashboardStats() {
  const { fetchedData, refetchData } = useFetchData("/user/user-stats");

  return (
    <div className="grid md:grid-cols-3 gap-3 md:gap-6">
      <StatsCard
        title="कुल सहकारी"
        totalCount={Number(fetchedData?.data?.agroFirms)}
        icon={
          <HiOutlineOfficeBuilding className="text-green-500 lg:w-8 lg:h-8 w-5 h-5" />
        }
      />
      <StatsCard
        title="कुल किसानहरू"
        totalCount={Number(fetchedData?.data?.normalUsers)}
        icon={
          <HiOutlineUserGroup className="text-green-500 lg:w-8 lg:h-8 w-5 h-5" />
        }
      />
      <StatsCard
        title="कुल विशेषज्ञहरू"
        totalCount={Number(fetchedData?.data?.experts)}
        icon={<GrUserExpert className="text-green-500 lg:w-8 lg:h-8 w-5 h-5" />}
      />
    </div>
  );
}
