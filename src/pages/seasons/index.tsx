import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import SeasonsList from "@/components/pagecomponents/seasonspage/SeasonsList";
import React from "react";

const Seasons = () => {
  return (
    <PageLayout>
      <GoBackButton />
      <SeasonsList />
    </PageLayout>
  );
};

export default withAuth(Seasons);
