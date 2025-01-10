// EditCostSheetPage.js
import PageLayout from "@/components/globalcomponents/PageLayout";
import EditCostSheet from "@/components/pagecomponents/costsheetpage/EditCostSheet";
import { axiosInstance } from "@/utils/axiosInstance";
import { CostSheet, CostSheetItem } from "@/utils/interface";
import React from "react";

export async function getServerSideProps({ params }: any) {
  const { slug: costSheetId } = params;

  try {
    const response = await axiosInstance.get(`/cost-sheet/${costSheetId}`);
    const costSheetData = response?.data?.data;

    if (!costSheetData) {
      return { notFound: true };
    }

    // Handle undefined properties
    const formattedData = {
      title: costSheetData.title || "",
      commodity: costSheetData.commodity || null,
      data:
        costSheetData.data?.map((item: CostSheetItem) => ({
          sn: item.sn ?? 0,
          type: item.type || "",
          name: item.name || "",
          unitType: item.unitType || "",
          quantity: item.quantity ?? 0,
          rate: item.rate ?? 0,
        })) || [],
      productionDetails: {
        mainProduction: costSheetData.productionDetails?.mainProduction ?? 0,
        sellingPrice: costSheetData.productionDetails?.sellingPrice ?? 0,
        gradualCropProduction:
          costSheetData.productionDetails?.gradualCropProduction ?? 0,
        gradualCropSalePrice:
          costSheetData.productionDetails?.gradualCropSalePrice ?? 0,
      },
    };

    return {
      props: { costSheetData: formattedData },
    };
  } catch (error) {
    console.error("Failed to fetch cost sheet data:", error);
    return { notFound: true }; // Redirect to 404 if fetch fails
  }
}

export default function EditCostSheetPage({
  costSheetData,
}: {
  costSheetData: CostSheet;
}) {
  return (
    <PageLayout>
      <EditCostSheet costSheetData={costSheetData} />
    </PageLayout>
  );
}
