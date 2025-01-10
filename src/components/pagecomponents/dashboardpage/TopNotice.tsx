import React from "react";
import useFetchData from "@/hook/useFetchData";
import { INotice } from "@/utils/interface";
import dayjs from "dayjs";
import { nepaliNumbers } from "@/utils/translations";
import { div } from "framer-motion/client";

export default function TopNotice() {
  const { fetchedData } = useFetchData("/notice");

  if (!fetchedData || !fetchedData.data || fetchedData.data.data.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg">
        <p className="font-semibold">No notices available.</p>
      </div>
    );
  }

  const notices: INotice[] = fetchedData.data.data.sort(({ a, b }: any) =>
    dayjs(b?.createdAt).diff(dayjs(a?.createdAt))
  );

  return (
    <div className="relative flex max-w-full bg-green-50 border border-primary text-primary p-3 rounded overflow-hidden">
      <div className="py-1 animate-marquee whitespace-nowrap">
        {notices.map((notice, index) => (
          <span key={notice.id} className="text-xs lg:text-sm font-medium mx-4">
            {nepaliNumbers(index + 1)}. {notice.title}
          </span>
        ))}
      </div>
    </div>
  );
}
