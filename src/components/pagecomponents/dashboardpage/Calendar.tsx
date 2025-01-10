// src/components/pagecomponents/dashboardpage/Calendar.tsx
import { Calendar } from "antd/lib";
import React from "react";

const MyCalendar: React.FC = () => {
  const onPanelChange = (value: any) => {
    console.log(value.format("YYYY-MM-DD"));
  };

  return (
    <div className=" bg-white p-4 shadow rounded-lg">
      <h1 className="text-primary font-medium lg:text-lg mb-4">
        Crop Calendar
      </h1>
      <Calendar onPanelChange={onPanelChange} fullscreen={false} />
    </div>
  );
};

export default MyCalendar;
