import { nepaliNumbers } from "@/utils/translations";
import React from "react";
import { LuTrendingUp } from "react-icons/lu";

interface IStats {
  title: string;
  totalCount: number;
  icon: React.ReactNode;
  comparison?: string;
}

const StatsCard: React.FC<IStats> = ({
  title,
  totalCount,
  icon,
  comparison,
}) => {
  return (
    <div className="bg-white rounded-lg  border p-3 md:p-5 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between space-x-4">
        <div>
          <div className="text-gray-600 text-xs md:text-sm font-medium md:font-semibold mb-1">
            {title}
          </div>
          <div className="text-gray-800 text-lg md:text-2xl lg:text-4xl font-medium md:font-semibold">
            {nepaliNumbers(totalCount)}
          </div>
        </div>
        <div className="lg:w-14 lg:h-14 w-10 h-10 flex items-center justify-center rounded-md bg-green-100">
          {icon}
        </div>
      </div>
      {comparison && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <LuTrendingUp className="text-green-600 mr-1" />
          <span> हिजो भन्दा {comparison}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
