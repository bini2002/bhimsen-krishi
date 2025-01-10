import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import AddBusinessCommodity from "@/components/pagecomponents/businesscommoditiespage/AddBusinessCommodity";
import React from "react";

export default function AddBusinessCommodityPage() {
  return (
    <PageLayout>
      <GoBackButton />
      <AddBusinessCommodity />
    </PageLayout>
  );
}
