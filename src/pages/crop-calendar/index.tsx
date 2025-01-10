import {
  GoBackButton,
  PrimaryButton,
} from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import React from "react";
import { Tabs } from "antd/lib";
import SeasonCalendar from "@/components/pagecomponents/calendarpage/SeasonCalendar";
import CropCalendar from "@/components/pagecomponents/calendarpage/CropCalendar";

const { TabPane } = Tabs;

const CropCalendarPage = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h1 className="text-xl lg:text-3xl font-medium text-primary">
          फसल तालिका
        </h1>
        <div className="flex gap-4">
          <PrimaryButton buttonName="फसलहरू हेर्नुहोस्" navigateTo="/crops" />
          <PrimaryButton
            buttonName="मौसामहरू हेर्नुहोस्"
            navigateTo="/seasons"
          />
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="मौसाम अनुसार" key="1">
          <SeasonCalendar />
        </TabPane>
        <TabPane tab="फसल अनुसार" key="2">
          <CropCalendar />
        </TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default withAuth(CropCalendarPage);
